import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { TestsModule } from './modules/tests/tests.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { ProgressModule } from './modules/progress/progress.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ForumModule } from './modules/forum/forum.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { HistoryModule } from './modules/history/history.module';
import { RatingModule } from './modules/rating/rating.module';
import { LoggerModule } from './common/logger/logger.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    LessonsModule,
    TestsModule,
    AssignmentsModule,
    ProgressModule,
    AchievementsModule,
    CertificatesModule,
    NotificationsModule,
    ForumModule,
    ReviewsModule,
    SuggestionsModule,
    HistoryModule,
    RatingModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
