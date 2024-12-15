import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { OnJiraStatus } from './decorators/status.decorator';
import { JIRA_STATUS } from './status.constants';
import { JiraWebhookEventDto } from './dto/webhook.dto';
import { prMapStringToJson } from './util';
import { ConfigService } from '@nestjs/config';

const {
  TODO,
  IN_PROGRESS,
  IN_REVIEW,
  BLOCKED,
  DONE,
  READY_TO_MERGE,
} = JIRA_STATUS;

@Injectable()
export class JiraStatusHandler {

  private JiraPrField: string
  constructor(private readonly logger: Logger, private config: ConfigService) {

    this.JiraPrField = this.config.getOrThrow('JIRA_GITHUB_FIELD')
  }

  @OnJiraStatus(TODO)
  handleTodoStatus(payload: JiraWebhookEventDto) {
    const { issue } = payload;
    this.logger.log({
      message: 'Issue moved to Todo',
      issueKey: issue.key,
    });
    return {
      message: `Issue ${issue.key} moved to Todo`,
      issue: {
        key: issue.key,
        summary: issue.fields.summary,
        status: TODO,
      },
    };
  }

  @OnJiraStatus(IN_PROGRESS)
  handleInProgressStatus(payload: JiraWebhookEventDto) {
    const { issue } = payload;
    this.logger.log({
      message: 'Issue moved to In Progress',
      issueKey: issue.key,
    });
    return {
      message: `Issue ${issue.key} moved to In Progress`,
      issue: {
        key: issue.key,
        summary: issue.fields.summary,
        status: IN_PROGRESS,
      },
    };
  }

  @OnJiraStatus(IN_REVIEW)
  handleInReviewStatus(payload: JiraWebhookEventDto) {
    const { issue } = payload;
    this.logger.log({
      message: 'Issue moved to In Review',
      issueKey: issue.key,
    });
    return {
      message: `Issue ${issue.key} moved to In Review`,
      issue: {
        key: issue.key,
        summary: issue.fields.summary,
        status: IN_REVIEW,
      },
    };
  }

  @OnJiraStatus(READY_TO_MERGE)
  handleReadyToMergeStatus(payload: JiraWebhookEventDto) {
    const { issue } = payload;
    this.logger.log({
      message: 'Issue moved to Ready to Merge!!!',
      issueKey: issue.key,
    });

    const pr = prMapStringToJson(issue.fields[this.JiraPrField]);
    return {
      message: `Issue ${issue.key} moved to Ready to Merge`,
      issue: {
        key: issue.key,
        summary: issue.fields.summary,
        status: READY_TO_MERGE,
        pr
      },
    };
  }

  @OnJiraStatus(BLOCKED)
  handleBlockedStatus(payload: JiraWebhookEventDto) {
    const { issue } = payload;
    this.logger.log({
      message: 'Issue marked as Blocked',
      issueKey: issue.key,
    });
    return {
      message: `Issue ${issue.key} marked as Blocked`,
      issue: {
        key: issue.key,
        summary: issue.fields.summary,
        status: BLOCKED,
      },
    };
  }

  @OnJiraStatus(DONE)
  handleDoneStatus(payload: JiraWebhookEventDto) {
    const { issue } = payload;
    this.logger.log({
      message: 'Issue completed',
      issueKey: issue.key,
    });
    return {
      message: `Issue ${issue.key} completed`,
      issue: {
        key: issue.key,
        summary: issue.fields.summary,
        status: DONE,
      },
    };
  }
}
