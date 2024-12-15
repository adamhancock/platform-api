import { Controller, Post, Headers } from '@nestjs/common';
import { JiraService } from './jira.service';
import { JiraWebhookEventDto } from './dto/webhook.dto';
import { VerifyJiraWebhook } from './decorators/webhook.decorator';

@Controller('jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) { }

  @Post('/webhook')
  async webhook(
    @VerifyJiraWebhook() payload: JiraWebhookEventDto,
  ) {
    return await this.jiraService.handleWebhookEvent(payload);
  }
}
