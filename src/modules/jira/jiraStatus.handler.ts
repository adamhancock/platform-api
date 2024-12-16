import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { OnJiraStatus } from './decorators/status.decorator';
import { JIRA_STATUS } from './status.constants';
import { JiraWebhookEventDto } from './dto/webhook.dto';
import { ConfigService } from '@nestjs/config';
import { GithubApiService } from '../github/githubApi.service';
import { JiraApiService } from './jiraApi.service';

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

  private JiraPrField: string;

  constructor(private readonly logger: Logger,
    private config: ConfigService,
    private github: GithubApiService,
    private jiraApi: JiraApiService) {
    this.JiraPrField = this.config.getOrThrow('JIRA_GITHUB_FIELD');
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
  async handleReadyToMergeStatus(payload: JiraWebhookEventDto) {
    const { issue } = payload;
    this.logger.log({
      message: 'Issue moved to Ready to Merge',
      issueKey: issue.key,
    });

    const { pullRequests } = await this.jiraApi.fetchGithubDevelopmentInformation(issue.id);

    if (pullRequests.length === 0) {
      this.logger.log({
        message: 'No PRs found for this issue',
        issueKey: issue.key,
      });
      return {
        status: 400,
        message: 'No PRs found for this issue',
      };
    }

    await this.github.mergeOpenPullRequests(pullRequests);

    // mark jira issue as done
    await this.jiraApi.updateJiraIssueStatus(issue.id, 'Done');

    return { status: 200, message: 'PRs merged successfully' };
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
