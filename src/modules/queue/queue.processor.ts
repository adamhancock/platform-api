import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('default')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);

  @Process()
  async process(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data:`,
      job.data,
    );

    // Add your job processing logic here
    try {
      // Example processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { processed: true, jobId: job.id };
    } catch (error) {
      this.logger.error(
        `Failed to process job ${job.id}:`,
        error instanceof Error ? error.stack : error,
      );
      throw error;
    }
  }
}
