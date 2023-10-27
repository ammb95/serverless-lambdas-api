import { S3 } from 'aws-sdk';
import { BUCKET_NAME } from 'src/constants';
import csv from 'csv-parser';
import { S3Event } from 'aws-lambda';

const importFileParser = async (event: S3Event) => {
  const s3 = new S3({ region: 'us-east-1' });

  try {
    for (const record of event.Records) {
      const params = {
        Bucket: BUCKET_NAME,
        Key: record.s3.object.key
      };

      const s3Stream = s3.getObject(params).createReadStream();

      const products = [];

      await new Promise<void>((resolve, reject) => {
        s3Stream
          .pipe(csv())
          .on('data', row => {
            products.push(row);
          })
          .on('end', () => {
            resolve();
          })
          .on('error', error => {
            console.error('Error parsing CSV:', error);
            reject(error);
          });
      });

      console.log('CSV parsing complete. Products: ', products);

      await s3
        .copyObject({
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace('uploaded', 'parsed')
        })
        .promise();

      await s3
        .deleteObject({
          Bucket: BUCKET_NAME,
          Key: record.s3.object.key
        })
        .promise();

      console.log('File successfully moved to "parsed" folder!');
    }
  } catch (error) {
    console.error(error);
  }
};

export const main = importFileParser;
