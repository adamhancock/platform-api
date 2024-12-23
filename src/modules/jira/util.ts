import { JiraPullRequestObject } from "./types";

export function prMapStringToJson(str: string) {

  // Replace the pullrequest part with valid JSON
  let fixed = str
    .replace('{pullrequest={dataType=pullrequest, state=OPEN, stateCount=1}, json=', '{"pullrequest":{"dataType":"pullrequest","state":"OPEN","stateCount":1}, "json":')
    // The above replacement converts the beginning into a proper JSON key/value pair.
    // Now remove the trailing extra brace at the end if needed
    .replace(/}\}$/, '}}');

  // Now fixed should be valid JSON
  console.log(fixed)
  return JSON.parse(fixed) as JiraPullRequestObject
}
