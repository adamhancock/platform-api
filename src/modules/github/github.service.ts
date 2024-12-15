import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { WEBHOOK_HANDLER_METADATA } from './decorators/webhook.decorator';
import { GithubWebhookHandler } from './github.handler';

@Injectable()
export class GithubService {
  constructor(private readonly webhookHandler: GithubWebhookHandler) { }

  // Method to dispatch events to appropriate handlers
  async handleWebhookEvent(event: string, payload: any) {
    const handlers = Reflect.getMetadata(WEBHOOK_HANDLER_METADATA, GithubWebhookHandler);
    if (!handlers || !handlers[event]) {
      throw new UnprocessableEntityException(`No handler registered for event: ${event}`);
    }

    const handlerMethod = handlers[event];
    return await this.webhookHandler[handlerMethod](payload);
  }
}
