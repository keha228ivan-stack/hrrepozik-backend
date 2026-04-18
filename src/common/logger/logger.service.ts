import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  override error(message: string, trace?: string) {
    super.error(message, trace);
  }
}
