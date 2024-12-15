import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GithubWebhookHandler } from './github.handler';

@Module({
  controllers: [GithubController],
  providers: [GithubService, GithubWebhookHandler],
})
export class GithubModule { }
