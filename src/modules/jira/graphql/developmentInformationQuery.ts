import { gql } from "graphql-request";

export const developmentInformationQuery = gql`
  query DevelopmentInformation($issueId: ID!) {
    developmentInformation(issueId: $issueId) {
      details {
        instanceTypes {
          id
          name
          repository {
            name
            url
            commits {
              id
              isMerge
              timestamp
              url
              createReviewUrl
              displayId
              message
            }
            branches {
              name
              url
              createReviewUrl
              createPullRequestUrl
            }
            pullRequests {
              id
              url
              name
              branchName
              branchUrl
              lastUpdate
              commentCount
              status
            }
          }
          type
        }
      }
    }
  }
`;
