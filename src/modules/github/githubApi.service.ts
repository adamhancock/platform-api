import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { MergePullRequestPayload } from './types';

@Injectable()
export class GithubApiService {
  constructor(private readonly api: Octokit) { }


  async mergePullRequest(
    payload: MergePullRequestPayload
  ): Promise<RestEndpointMethodTypes['pulls']['merge']['response']> {
    const { owner, repo, number } = payload;

    return this.api.rest.pulls.merge({
      owner: owner,
      repo: repo,
      pull_number: number,
    });
  }

  async mergeOpenPullRequests(payload: MergePullRequestPayload[]) {
    for await (const pullRequest of payload) {
      if (pullRequest.status !== 'OPEN') {
        continue;
      }
      await this.mergePullRequest(pullRequest);
    }
  }
}
