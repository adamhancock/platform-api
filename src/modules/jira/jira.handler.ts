import { Injectable } from '@nestjs/common';
import { OnJiraWebhook } from './decorators/webhook.decorator';
import { Logger } from 'nestjs-pino';
import { JIRA_WEBHOOK_EVENTS } from './events';
import { JiraWebhookEventDto } from './dto/webhook.dto';
import { JiraStatusHandler } from './jiraStatus.handler';
import { JIRA_STATUS_HANDLER_METADATA } from './decorators/status.decorator';
import { ConfigService } from '@nestjs/config';
import { JiraService } from './jira.service';
import { prMapStringToJson } from './util';

const {
  ISSUE_CREATED,
  ISSUE_UPDATED,
  ISSUE_DELETED,
} = JIRA_WEBHOOK_EVENTS;

@Injectable()
export class JiraWebhookHandler {
  private JiraPrField: string
  constructor(
    private readonly logger: Logger,
    private readonly statusHandler: JiraStatusHandler,
    private config: ConfigService,
  ) {
    this.JiraPrField = this.config.getOrThrow('JIRA_GITHUB_FIELD')
  }



  @OnJiraWebhook(ISSUE_CREATED)
  handleIssueCreated(payload: JiraWebhookEventDto) {
    this.logger.log('Processing issue created event');
    const { issue, user } = payload;
    return {
      message: `Received issue created event for ${issue.key}`,
      issue: {
        key: issue.key,
        summary: issue.fields.summary,
        creator: user.displayName,
      },
    };
  }

  @OnJiraWebhook(ISSUE_UPDATED)
  handleIssueUpdated(payload: JiraWebhookEventDto) {
    this.logger.log('Processing issue updated event');
    const { issue, changelog } = payload;

    // Check if this update includes a status change
    const statusChange = changelog?.items?.find(item => item.field === 'status');
    if (statusChange) {
      const currentStatus = issue.fields.status.name;

      // Get the handler method for this status
      const handlers = Reflect.getMetadata(JIRA_STATUS_HANDLER_METADATA, JiraStatusHandler);
      const handlerMethod = handlers[currentStatus];

      if (handlerMethod) {
        return this.statusHandler[handlerMethod](payload);
      }

      // Fallback for unhandled status
      this.logger.log({
        message: 'Unhandled status change',
        issueKey: issue.key,
        fromStatus: statusChange.fromString,
        toStatus: currentStatus,
      });
    }

  }
}
