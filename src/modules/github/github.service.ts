import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { WEBHOOK_HANDLER_METADATA } from './decorators/webhook.decorator';
import { GithubWebhookHandler } from './github.handler';
import { DependabotAlertService } from './dependabotAlert.service';
import { DependabotAlertPayload } from './types';

@Injectable()
export class GithubService {
  constructor(
    private readonly webhookHandler: GithubWebhookHandler,
    private readonly dependabotService: DependabotAlertService,
  ) { }

  // Method to dispatch events to appropriate handlers
  async handleWebhookEvent(event: string, payload: any) {
    // Handle Dependabot alerts separately
    if (event === 'dependabot_alert') {
      return await this.dependabotService.handleAlertEvent(payload as DependabotAlertPayload);
    }

    // Handle other webhook events
    const handlers = Reflect.getMetadata(WEBHOOK_HANDLER_METADATA, GithubWebhookHandler);
    if (!handlers || !handlers[event]) {
      throw new UnprocessableEntityException(`No handler registered for event: ${event}`);
    }

    const handlerMethod = handlers[event];
    return await this.webhookHandler[handlerMethod](payload);
  }
}
