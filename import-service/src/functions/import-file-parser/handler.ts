import { S3, SQS } from 'aws-sdk';
import { S3Event, S3Handler } from 'aws-lambda';
import csv from 'csv-parser';
import { BUCKET_NAME } from 'src/constants';
import { moveObject } from './move-object';
import { sendItemToQueue } from './send-item-to-queue';
import { mapRowToProduct } from './map-row-to-product';
import { Product } from './product.model';

const importFileParser: S3Handler = async (event: S3Event) => {
  const s3 = new S3({ region: 'us-east-1' });
  const sqs = new SQS({ region: 'us-east-1' });

  try {
    for (const record of event.Records) {
      const params = {
        Bucket: BUCKET_NAME,
        Key: record.s3.object.key
      };

      const s3Stream = s3.getObject(params).createReadStream();

      const products: Product[] = [];

      await new Promise<void>((resolve, reject) => {
        s3Stream
          .pipe(csv())
          .on('data', row => {
            products.push(mapRowToProduct(row));
          })
          .on('end', () => {
            resolve();
          })
          .on('error', error => {
            console.error('Error parsing CSV:', error);
            reject(error);
          });
      });

      products.forEach(product => sendItemToQueue(sqs, product));

      await moveObject(s3, record);
    }
  } catch (error) {
    console.error(error);
  }
};

export const main = importFileParser;
