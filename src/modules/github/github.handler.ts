import { Injectable } from '@nestjs/common';
import { OnGithubWebhook } from './decorators/webhook.decorator';
import { Logger } from 'nestjs-pino';
import { DependabotAlertPayload } from './types';

@Injectable()
export class GithubWebhookHandler {
  constructor(private readonly logger: Logger) { }

  // Handler for push events
  @OnGithubWebhook('push')
  handlePushEvent(payload: any) {
    this.logger.log('Processing push event');
    const { repository, commits } = payload;
    return {
      message: `Received push event for ${repository.full_name}`,
      commits: commits?.length || 0,
    };
  }

  // Handler for pull request events
  @OnGithubWebhook('pull_request')
  handlePullRequestEvent(payload: any) {
    this.logger.log('Processing pull request event');
    const { action, pull_request, repository } = payload;
    return {
      message: `Received pull request ${action} event for ${repository.full_name}`,
      pr: {
        number: pull_request.number,
        title: pull_request.title,
        state: pull_request.state,
      },
    };
  }

  @OnGithubWebhook('issue_comment')
  handleIssueCommentEvent(payload: any) {
    this.logger.log('Processing issue comment event');
    const { action, issue, repository } = payload;
    return {
      message: `Received issue comment ${action} event for ${repository.full_name}`,
      issue: {
        number: issue.number,
        title: issue.title,
        state: issue.state,
      },
    };
  }

  @OnGithubWebhook('dependabot_alert')
  handleDependabotAlertEvent(payload: DependabotAlertPayload) {
    this.logger.log('Processing Dependabot alert event');
    const { action, alert, repository } = payload;

    return {
      message: `Received Dependabot alert ${action} event for ${repository.full_name}`,
      alert: {
        number: alert.number,
        state: alert.state,
        package: alert.dependency.package.name,
        ecosystem: alert.dependency.package.ecosystem,
        severity: alert.security_advisory.severity,
        summary: alert.security_advisory.summary,
        cvssScore: alert.security_advisory.cvss.score,
        createdAt: alert.created_at,
        updatedAt: alert.updated_at
      }
    };
  }
}
