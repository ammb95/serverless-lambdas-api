import { SQS } from 'aws-sdk';
import { QUEUE_URL } from 'src/constants';

export const sendItemToQueue = (sqs: SQS, product: any) => {
  sqs.sendMessage(
    {
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(product)
    },
    err => {
      if (err) {
        console.error('Error sending message to SQS:', err);
      }
    }
  );
};
