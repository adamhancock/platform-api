import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JIRA_WEBHOOK_HANDLER_METADATA } from './decorators/webhook.decorator';
import { JiraWebhookHandler } from './jira.handler';
@Injectable()
export class JiraService {
  constructor(
    private readonly webhookHandler: JiraWebhookHandler,
  ) { }

  // Method to dispatch events to appropriate handlers
  async handleWebhookEvent(payload: any) {

    const event = payload.webhookEvent;
    const handlers = Reflect.getMetadata(JIRA_WEBHOOK_HANDLER_METADATA, JiraWebhookHandler);

    if (!handlers || !handlers[event]) {
      throw new UnprocessableEntityException(`No handler registered for event: ${event}`);
    }

    const handlerMethod = handlers[event];
    return await this.webhookHandler[handlerMethod](payload);
  }


}
