import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AvatarUrlsDto {
  @IsString()
  '48x48': string;

  @IsString()
  '24x24': string;

  @IsString()
  '16x16': string;

  @IsString()
  '32x32': string;
}

class UserDto {
  @IsString()
  self: string;

  @IsString()
  accountId: string;

  @ValidateNested()
  @Type(() => AvatarUrlsDto)
  avatarUrls: AvatarUrlsDto;

  @IsString()
  displayName: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  timeZone: string;

  @IsString()
  accountType: string;
}

class StatusCategoryDto {
  @IsString()
  self: string;

  @IsNumber()
  id: number;

  @IsString()
  key: string;

  @IsString()
  colorName: string;

  @IsString()
  name: string;
}

class StatusDto {
  @IsString()
  self: string;

  @IsString()
  description: string;

  @IsString()
  iconUrl: string;

  @IsString()
  name: string;

  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => StatusCategoryDto)
  statusCategory: StatusCategoryDto;
}

class IssueTypeDto {
  @IsString()
  self: string;

  @IsString()
  id: string;

  @IsString()
  description: string;

  @IsString()
  iconUrl: string;

  @IsString()
  name: string;

  @IsBoolean()
  subtask: boolean;

  @IsNumber()
  avatarId: number;

  @IsString()
  entityId: string;

  @IsNumber()
  hierarchyLevel: number;
}

class PriorityDto {
  @IsString()
  self: string;

  @IsString()
  iconUrl: string;

  @IsString()
  name: string;

  @IsString()
  id: string;
}

class IssuerestrictionDto {
  @IsObject()
  issuerestrictions: Record<string, unknown>;

  @IsBoolean()
  shouldDisplay: boolean;
}

class WatchesDto {
  @IsString()
  self: string;

  @IsNumber()
  watchCount: number;

  @IsBoolean()
  isWatching: boolean;
}

class ProjectAvatarUrlsDto extends AvatarUrlsDto { }

class ProjectDto {
  @IsString()
  self: string;

  @IsString()
  id: string;

  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsString()
  projectTypeKey: string;

  @IsBoolean()
  simplified: boolean;

  @ValidateNested()
  @Type(() => ProjectAvatarUrlsDto)
  avatarUrls: ProjectAvatarUrlsDto;
}

class NonEditableReasonDto {
  @IsString()
  reason: string;

  @IsString()
  message: string;
}

class Customfield10018Dto {
  @IsBoolean()
  hasEpicLinkFieldDependency: boolean;

  @IsBoolean()
  showField: boolean;

  @ValidateNested()
  @Type(() => NonEditableReasonDto)
  nonEditableReason: NonEditableReasonDto;
}

class ProgressDto {
  @IsNumber()
  progress: number;

  @IsNumber()
  total: number;
}

class WorklogDto {
  @IsNumber()
  startAt: number;

  @IsNumber()
  maxResults: number;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorklogItemDto)
  worklogs: WorklogItemDto[];
}

class WorklogItemDto {
  @IsString()
  self: string;

  @ValidateNested()
  @Type(() => UserDto)
  author: UserDto;

  @ValidateNested()
  @Type(() => UserDto)
  updateAuthor: UserDto;

  @IsString()
  created: string;

  @IsString()
  updated: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  started: string;

  @IsNumber()
  timeSpentSeconds: number;

  @IsString()
  id: string;

  @IsString()
  issueId: string;
}

class CommentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentItemDto)
  comments: CommentItemDto[];

  @IsString()
  self: string;

  @IsNumber()
  maxResults: number;

  @IsNumber()
  total: number;

  @IsNumber()
  startAt: number;
}

class CommentItemDto {
  @IsString()
  self: string;

  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => UserDto)
  author: UserDto;

  @IsString()
  body: string;

  @ValidateNested()
  @Type(() => UserDto)
  updateAuthor: UserDto;

  @IsString()
  created: string;

  @IsString()
  updated: string;
}

class VersionDto {
  @IsString()
  self: string;

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  archived: boolean;

  @IsBoolean()
  released: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}



class IssueLinkTypeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  inward: string;

  @IsString()
  outward: string;

  @IsString()
  self: string;
}

class LinkedIssueFieldsDto {
  @IsString()
  summary: string;

  @ValidateNested()
  @Type(() => StatusDto)
  status: StatusDto;

  @ValidateNested()
  @Type(() => PriorityDto)
  priority: PriorityDto;

  @ValidateNested()
  @Type(() => IssueTypeDto)
  issuetype: IssueTypeDto;
}
class LinkedIssueDto {
  @IsString()
  id: string;

  @IsString()
  key: string;

  @IsString()
  self: string;

  @ValidateNested()
  @Type(() => LinkedIssueFieldsDto)
  fields: LinkedIssueFieldsDto;
}


class IssueLinkDto {
  @IsString()
  id: string;

  @IsString()
  self: string;

  @ValidateNested()
  @Type(() => IssueLinkTypeDto)
  type: IssueLinkTypeDto;

  @ValidateNested()
  @Type(() => LinkedIssueDto)
  inwardIssue?: LinkedIssueDto;

  @ValidateNested()
  @Type(() => LinkedIssueDto)
  outwardIssue?: LinkedIssueDto;
}



class ComponentDto {
  @IsString()
  self: string;

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}

class AttachmentDto {
  @IsString()
  self: string;

  @IsString()
  id: string;

  @IsString()
  filename: string;

  @ValidateNested()
  @Type(() => UserDto)
  author: UserDto;

  @IsString()
  created: string;

  @IsNumber()
  size: number;

  @IsString()
  mimeType: string;

  @IsString()
  content: string;

  @IsString()
  thumbnail?: string;
}

class IssueFieldsDto {
  @IsString()
  statuscategorychangedate: string;

  @ValidateNested()
  @Type(() => IssueTypeDto)
  issuetype: IssueTypeDto;

  @IsOptional()
  timespent: number | null;

  @ValidateNested()
  @Type(() => ProjectDto)
  project: ProjectDto;

  @ValidateNested()
  @Type(() => IssuerestrictionDto)
  issuerestriction: IssuerestrictionDto;

  @ValidateNested()
  @Type(() => WatchesDto)
  watches: WatchesDto;

  @IsString()
  created: string;

  @ValidateNested()
  @Type(() => PriorityDto)
  priority: PriorityDto;

  @IsArray()
  labels: string[];

  @ValidateNested()
  @Type(() => Customfield10018Dto)
  customfield_10018: Customfield10018Dto;

  @IsString()
  customfield_10019: string;

  @IsString()
  customfield_10000: string;

  @IsOptional()
  timeestimate: number | null;

  @IsOptional()
  aggregatetimeoriginalestimate: number | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VersionDto)
  versions: VersionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IssueLinkDto)
  issuelinks: IssueLinkDto[];

  @IsOptional()
  assignee: UserDto | null;

  @IsString()
  updated: string;

  @ValidateNested()
  @Type(() => StatusDto)
  status: StatusDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentDto)
  components: ComponentDto[];

  @IsOptional()
  timeoriginalestimate: number | null;

  @IsString()
  description: string;

  @IsObject()
  timetracking: Record<string, unknown>;

  @IsOptional()
  security: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachment: AttachmentDto[];

  @IsString()
  summary: string;

  @ValidateNested()
  @Type(() => UserDto)
  creator: UserDto;

  @IsArray()
  subtasks: any[];

  @ValidateNested()
  @Type(() => UserDto)
  reporter: UserDto;

  @ValidateNested()
  @Type(() => ProgressDto)
  aggregateprogress: ProgressDto;

  @ValidateNested()
  @Type(() => ProgressDto)
  progress: ProgressDto;

  @ValidateNested()
  @Type(() => CommentDto)
  @IsOptional()
  comment?: CommentDto;


  @ValidateNested()
  @Type(() => WorklogDto)
  @IsOptional()
  worklog?: WorklogDto;
}

class IssueDto {
  @IsString()
  id: string;

  @IsString()
  self: string;

  @IsString()
  key: string;

  @ValidateNested()
  @Type(() => IssueFieldsDto)
  fields: IssueFieldsDto;
}

class ChangelogItemDto {
  @IsString()
  field: string;

  @IsString()
  fieldtype: string;

  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsString()
  fromString: string;

}

class ChangelogDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChangelogItemDto)
  items: ChangelogItemDto[];
}



export class JiraWebhookEventDto {
  @IsNumber()
  timestamp: number;

  @IsString()
  webhookEvent: string;

  @IsOptional()
  @IsString()
  issue_event_type_name?: string; // e.g. "issue_created"

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => IssueDto)
  issue: IssueDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChangelogDto)
  changelog?: ChangelogDto;

}
