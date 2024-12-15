import { Module } from '@nestjs/common';
import { GithubModule } from './github/github.module';
import { QueueModule } from './queue/queue.module';
import { JiraModule } from './jira/jira.module';

@Module({
  imports: [GithubModule, QueueModule, JiraModule]
})
export class ModulesModule { }
