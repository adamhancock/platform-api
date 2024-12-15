export type JiraPullRequest = {
  dataType: string;
  state: string;
  stateCount: number;
};

export type JiraPullRequestObject = {
  pullrequest: JiraPullRequest;
  json: any;
};
