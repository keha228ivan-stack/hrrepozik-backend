import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const [employeeRole, managerRole, adminRole] = await Promise.all([
    prisma.role.upsert({ where: { name: 'employee' }, update: {}, create: { name: 'employee', description: 'Employee user' } }),
    prisma.role.upsert({ where: { name: 'manager' }, update: {}, create: { name: 'manager', description: 'Manager user' } }),
    prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin', description: 'Administrator user' } }),
  ]);

  const engineering = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: { name: 'Engineering', description: 'Engineering department' },
  });

  const passwordHash = await bcrypt.hash('password123', 10);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@hrrepozik.local' },
    update: {},
    create: {
      email: 'manager@hrrepozik.local',
      passwordHash,
      firstName: 'Maria',
      lastName: 'Manager',
      roleId: managerRole.id,
      departmentId: engineering.id,
      position: 'Team Lead',
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@hrrepozik.local' },
    update: {},
    create: {
      email: 'employee@hrrepozik.local',
      passwordHash,
      firstName: 'Egor',
      lastName: 'Employee',
      roleId: employeeRole.id,
      departmentId: engineering.id,
      position: 'Backend Developer',
    },
  });

  const course = await prisma.course.create({
    data: {
      title: 'Node.js Fundamentals',
      description: 'Base course for LMS bootstrap',
      category: 'Backend',
      difficulty: "BEGINNER",
      durationMinutes: 180,
      status: "PUBLISHED",
      isPublished: true,
      modules: {
        create: [
          {
            title: 'Intro',
            sortOrder: 1,
            lessons: {
              create: [
                {
                  title: 'What is Node.js',
                  content: 'Runtime basics',
                  lessonType: 'video',
                  durationMinutes: 20,
                  sortOrder: 1,
                },
              ],
            },
          },
        ],
      },
      tests: {
        create: {
          title: 'Node Quiz',
          description: 'Final check',
          passingScore: 70,
          maxAttempts: 3,
          isFinal: true,
          questions: {
            create: {
              questionText: 'Node.js built on?',
              questionType: "SINGLE_CHOICE",
              sortOrder: 1,
              answers: {
                create: [
                  { answerText: 'V8', isCorrect: true },
                  { answerText: 'JVM', isCorrect: false },
                ],
              },
            },
          },
        },
      },
    },
  });

  await prisma.userCourseProgress.upsert({
    where: { userId_courseId: { userId: employee.id, courseId: course.id } },
    update: {},
    create: {
      userId: employee.id,
      courseId: course.id,
      progressPercent: 15,
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: employee.id,
      title: 'Добро пожаловать',
      message: 'Ваш курс назначен и готов к прохождению.',
      type: "INFO",
    },
  });

  await prisma.courseSuggestion.create({
    data: {
      userId: employee.id,
      title: 'Docker для backend',
      description: 'Хотелось бы курс по контейнеризации.',
    },
  });

  console.log({ adminRole: adminRole.id, manager: manager.email, employee: employee.email, course: course.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
