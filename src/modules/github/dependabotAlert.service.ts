import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DEPENDABOT_ALERT_HANDLER_METADATA } from './decorators/dependabot.decorator';
import { DependabotAlertHandler } from './dependabotAlert.handler';
import { DependabotAlertPayload } from './types';

@Injectable()
export class DependabotAlertService {
  constructor(private readonly alertHandler: DependabotAlertHandler) { }

  async handleAlertEvent(payload: DependabotAlertPayload) {
    const handlers = Reflect.getMetadata(
      DEPENDABOT_ALERT_HANDLER_METADATA,
      DependabotAlertHandler,
    );

    if (!handlers || !handlers[payload.action]) {
      throw new UnprocessableEntityException(
        `No handler registered for Dependabot alert action: ${payload.action}`,
      );
    }

    const handlerMethod = handlers[payload.action];
    return await this.alertHandler[handlerMethod](payload);
  }
}
