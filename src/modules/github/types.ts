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
