import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config";

export const requestQueueName = "friend-request-send-queue";

export const requestQueue = new Queue(requestQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueOptions
});

// Worker

export const requestQueueWorker = new Worker(requestQueueName, async (job: Job) => {
    const data = job.data;

    console.log("job received in the request queue", data);
}, { connection: redisConnection });