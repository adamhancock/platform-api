import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GithubWebhookHandler } from './github.handler';
import { DependabotAlertHandler } from './dependabotAlert.handler';
import { DependabotAlertService } from './dependabotAlert.service';
import { Octokit } from 'octokit';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createAppAuth } from '@octokit/auth-app';
import { GithubApiService } from './githubApi.service';

@Module({
  imports: [ConfigModule],
  controllers: [GithubController],
  providers: [
    GithubService,
    GithubWebhookHandler,
    DependabotAlertHandler,
    DependabotAlertService,
    {
      provide: Octokit,
      useFactory: (configService: ConfigService) => {
        // @ts-ignore
        const privateKey = Buffer.from(configService.getOrThrow('GITHUB_PRIVATE_KEY'), 'base64').toString('utf-8')
        return new Octokit({
          authStrategy: createAppAuth,
          auth: {
            appId: configService.getOrThrow('GITHUB_APP_ID'),
            // base64 encoded private key
            privateKey,
            installationId: configService.getOrThrow('GITHUB_INSTALLATION_ID'),
          }
        })
      },
      inject: [ConfigService],
    },
    GithubApiService
  ],
  exports: [GithubApiService]
})
export class GithubModule { }
