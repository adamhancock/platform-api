export type MergePullRequestPayload = {
  owner: string;
  repo: string;
  number: number;
  id: string;
  url: string;
  name: string;
  branchName: string;
  branchUrl: string;
  lastUpdate: string;
  commentCount: number;
  status: string;
}

export type DependabotAlertPayload = {
  action: 'created' | 'dismissed' | 'resolved' | 'reopened';
  alert: {
    number: number;
    state: string;
    dependency: {
      package: {
        name: string;
        ecosystem: string;
      };
      manifest_path: string;
      scope: string;
    };
    security_advisory: {
      summary: string;
      description: string;
      severity: string;
      cvss: {
        score: number;
        vector_string: string;
      };
      references: string[];
      identifiers: Array<{
        type: string;
        value: string;
      }>;
    };
    created_at: string;
    updated_at: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
}
