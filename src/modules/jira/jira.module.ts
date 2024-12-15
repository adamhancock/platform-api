import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Version3Client } from 'jira.js';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';
import { JiraWebhookHandler } from './jira.handler';
import { JiraStatusHandler } from './jiraStatus.handler';
import { GithubModule } from '../github/github.module';
import { JiraApiService } from './jiraApi.service';

@Module({
  imports: [ConfigModule, GithubModule],
  controllers: [JiraController],
  providers: [
    {
      provide: Version3Client,
      useFactory: (configService: ConfigService) => {
        return new Version3Client({
          host: configService.get('JIRA_HOST'),
          authentication: {
            basic: {
              email: configService.get('JIRA_EMAIL'),
              apiToken: configService.get('JIRA_API_TOKEN'),
            },
          },
        });
      },
      inject: [ConfigService],
    },
    JiraService,
    JiraWebhookHandler,
    JiraStatusHandler,
    JiraApiService
  ],
  exports: [JiraService, JiraWebhookHandler, JiraStatusHandler, JiraApiService, Version3Client],
})
export class JiraModule { }
