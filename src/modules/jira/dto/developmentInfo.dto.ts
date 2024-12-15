import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CommitDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  isMerge: boolean;

  @IsDateString()
  timestamp: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsString()
  createReviewUrl?: string | null;

  @IsString()
  @IsNotEmpty()
  displayId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

class BranchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsString()
  createReviewUrl?: string | null;

  @IsOptional()
  @IsString()
  createPullRequestUrl?: string;
}

class PullRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  branchName: string;

  @IsString()
  @IsNotEmpty()
  branchUrl: string;

  @IsDateString()
  lastUpdate: string;

  @IsNotEmpty()
  commentCount: number;

  @IsString()
  @IsNotEmpty()
  status: string;
}

class RepositoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommitDto)
  commits: CommitDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BranchDto)
  branches: BranchDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PullRequestDto)
  pullRequests: PullRequestDto[];
}

class InstanceTypeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepositoryDto)
  repository: RepositoryDto[];

  @IsString()
  @IsNotEmpty()
  type: string;
}

class DetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstanceTypeDto)
  instanceTypes: InstanceTypeDto[];
}

class DevelopmentInformationDto {
  @ValidateNested()
  @Type(() => DetailsDto)
  details: DetailsDto;
}

export class DevelopmentInformationRootDto {
  @ValidateNested()
  @Type(() => DevelopmentInformationDto)
  developmentInformation: DevelopmentInformationDto;
}
