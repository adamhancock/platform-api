import { Injectable } from '@nestjs/common';
import { Version3Client } from 'jira.js';
import { request } from 'graphql-request';
import { developmentInformationQuery } from './graphql/developmentInformationQuery';
import { JIRA_GRAPHQL_ENDPOINT } from './constants';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { DevelopmentInformationRootDto } from './dto/developmentInfo.dto';

@Injectable()
export class JiraApiService {
  constructor(
    private readonly api: Version3Client,
    private readonly config: ConfigService,
    private readonly logger: Logger
  ) { }

  getIssue(issueKey: string) {
    return this.api.issues.getIssue({ issueIdOrKey: issueKey });
  }



  async fetchGithubDevelopmentInformation(issueId: string) {
    const data = await this.fetchDevelopmentInformation(issueId);

    const githubData = data.developmentInformation.details.instanceTypes.find(
      (instanceType) => instanceType.id === 'com.github.integration.production',
    );
    // create a map of all the PRs
    const pullRequests = githubData.repository.flatMap((pr) => pr.pullRequests.map((pullRequest) => {
      const { owner, repo, number } = this.getGithubOwnerRepoAndNumberFromUrl(pullRequest.url);


      return {
        ...pullRequest,
        owner,
        repo,
        number,
      }
    }))

    return { pullRequests };
  }

  async updateJiraIssueStatus(issueId: string, status: string) {
    const transitions = await this.api.issues.getTransitions({ issueIdOrKey: issueId })
    const transitionId = transitions.transitions.find((transition) => transition.name === status)?.id;
    return this.api.issues.doTransition({
      issueIdOrKey: issueId,
      transition: {
        id: transitionId,
      },
    });
  }

  private getAuthHeader() {

    const username = this.config.getOrThrow('JIRA_EMAIL');
    const password = this.config.getOrThrow('JIRA_API_TOKEN');

    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    return `Basic ${auth}`;
  }

  private getGithubOwnerRepoAndNumberFromUrl(url: string) {
    // Extract the owner, repo, and number from the URL
    const match = url.match(/https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }
    const [, owner, repo, number] = match;
    return { owner, repo, number: Number(number) };
  }

  private async fetchDevelopmentInformation(issueId: string) {
    try {
      const headers = {
        Authorization: this.getAuthHeader(),
        'X-ExperimentalApi': 'IssueDevelopmentInformation',
      };

      const JIRA_TENANT_ID = this.config.get('JIRA_TENANT_ID');
      issueId = `ari:cloud:jira:${JIRA_TENANT_ID}:issue/${issueId}`;
      // Variables to pass into the query
      const variables = {
        issueId, // Equivalent to { issueId: issueId }
      };

      const data = await request(JIRA_GRAPHQL_ENDPOINT, developmentInformationQuery, variables, headers) as DevelopmentInformationRootDto;

      return data

    } catch (error) {
      this.logger.error('Error fetching development information:', error);
      throw error;
    }
  }
}
