import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { WEBHOOK_HANDLER_METADATA } from './decorators/webhook.decorator';
import { GithubWebhookHandler } from './github.handler';
import { Octokit } from 'octokit';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

@Injectable()
export class GithubApiService {
  constructor(private readonly api: Octokit) { }


  async mergePullRequest(
    owner: string,
    repo: string,
    pull_number: number
  ): Promise<RestEndpointMethodTypes['pulls']['merge']['response']> {
    return this.api.rest.pulls.merge({
      owner: owner,
      repo: repo,
      pull_number: pull_number,
    });
  }
}
