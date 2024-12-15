import { Controller, Post, Headers } from '@nestjs/common';
import { GithubService } from './github.service';
import { VerifyGithubWebhook } from './decorators/webhook.decorator';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) { }

  @Post('/webhook')
  async webhook(
    @Headers('x-github-event') event: string,
    @VerifyGithubWebhook() payload: any,
  ) {
    return await this.githubService.handleWebhookEvent(event, payload);
  }
}
