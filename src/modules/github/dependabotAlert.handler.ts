import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { OnDependabotAlert } from './decorators/dependabot.decorator';
import { DEPENDABOT_ALERT_STATE } from './dependabot.constants';
import { DependabotAlertPayload } from './types';
import { GithubApiService } from './githubApi.service';

const {
  CREATED,
  DISMISSED,
  RESOLVED,
  REOPENED,
} = DEPENDABOT_ALERT_STATE;

@Injectable()
export class DependabotAlertHandler {
  constructor(
    private readonly logger: Logger,
    private readonly github: GithubApiService,
  ) { }

  @OnDependabotAlert(CREATED)
  async handleCreatedAlert(payload: DependabotAlertPayload) {
    const { alert, repository } = payload;
    this.logger.log({
      message: 'New Dependabot alert created',
      repository: repository.full_name,
      alert: {
        number: alert.number,
        package: alert.dependency.package.name,
        severity: alert.security_advisory.severity,
      },
    });

    // Could potentially create an issue or PR automatically here using github service

    return {
      message: `New Dependabot alert created for ${repository.full_name}`,
      alert: {
        number: alert.number,
        package: alert.dependency.package.name,
        ecosystem: alert.dependency.package.ecosystem,
        severity: alert.security_advisory.severity,
        summary: alert.security_advisory.summary,
        cvssScore: alert.security_advisory.cvss.score,
      },
    };
  }

  @OnDependabotAlert(DISMISSED)
  handleDismissedAlert(payload: DependabotAlertPayload) {
    const { alert, repository } = payload;
    this.logger.log({
      message: 'Dependabot alert dismissed',
      repository: repository.full_name,
      alert: {
        number: alert.number,
        package: alert.dependency.package.name,
      },
    });

    return {
      message: `Dependabot alert dismissed for ${repository.full_name}`,
      alert: {
        number: alert.number,
        package: alert.dependency.package.name,
        state: alert.state,
      },
    };
  }

  @OnDependabotAlert(RESOLVED)
  handleResolvedAlert(payload: DependabotAlertPayload) {
    const { alert, repository } = payload;
    this.logger.log({
      message: 'Dependabot alert resolved',
      repository: repository.full_name,
      alert: {
        number: alert.number,
        package: alert.dependency.package.name,
      },
    });

    return {
      message: `Dependabot alert resolved for ${repository.full_name}`,
      alert: {
        number: alert.number,
        package: alert.dependency.package.name,
        state: alert.state,
      },
    };
  }

  @OnDependabotAlert(REOPENED)
  handleReopenedAlert(payload: DependabotAlertPayload) {
    const { alert, repository } = payload;
    this.logger.log({
      message: 'Dependabot alert reopened',
      repository: repository.full_name,
      alert: {
        number: alert.number,
        package: alert.dependency.package.name,
        severity: alert.security_advisory.severity,
      },
    });

    return {
      message: `Dependabot alert reopened for ${repository.full_name}`,
      alert: {
        number: alert.number,
        package: alert.dependency.package.name,
        severity: alert.security_advisory.severity,
        summary: alert.security_advisory.summary,
        state: alert.state,
      },
    };
  }
}
