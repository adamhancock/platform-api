# Platform API

Platform API is a web API that connects Jira and GitHub repositories. It allows you to automatically update Jira issues based on GitHub pull requests and comments.

## Webhooks

- Jira Webhook
- GitHub Webhook

## Jira Webhook

Create a webhook for Jira and configure it to send a POST request to the `/api/jira/webhook` endpoint.

## GitHub Webhook

Create a webhook for GitHub and configure it to send a POST request to the `/api/github/webhook` endpoint.

## Environment Variables

### GitHub Configuration

- `GITHUB_WEBHOOK_SECRET`: The secret key used to verify the GitHub webhook signature
- `GITHUB_PRIVATE_KEY`: RSA private key for GitHub App authentication
- `GITHUB_APP_TOKEN`: GitHub App token for API authentication
- `GITHUB_APP_ID`: GitHub App ID
- `GITHUB_APP_SECRET`: GitHub App secret key
- `GITHUB_INSTALLATION_ID`: Installation ID for the GitHub App

### Jira Configuration

- `JIRA_HOST`: Jira instance URL (e.g., https://your-domain.atlassian.net)
- `JIRA_EMAIL`: Email address associated with the Jira account
- `JIRA_API_TOKEN`: API token for Jira authentication
- `JIRA_WEBHOOK_SECRET`: The secret key used to verify the Jira webhook signature
- `JIRA_GITHUB_FIELD`: Custom field ID in Jira for GitHub integration
- `JIRA_TENANT_ID`: Jira tenant/organization ID
