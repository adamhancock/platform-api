import { Injectable } from '@nestjs/common';
import { Queue, JobType, JobState } from 'bullmq';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('default') private queue: Queue) { }

  async addJob(name: string, data: any) {
    return this.queue.add(name, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  async getJob(jobId: string) {
    return this.queue.getJob(jobId);
  }

  async getJobs(types: JobType[], status: JobState[]) {
    return this.queue.getJobs(status, 0, -1, true);
  }
}
