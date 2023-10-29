import { S3 } from 'aws-sdk';
import { S3EventRecord } from 'aws-lambda';
import { BUCKET_NAME } from 'src/constants';

export const moveObject = async (s3: S3, record: S3EventRecord) => {
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
};
