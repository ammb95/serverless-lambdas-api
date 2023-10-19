import { BUCKET_NAME, FOLDER_NAME } from 'src/constants';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [{ prefix: `${FOLDER_NAME}/` }],
        existing: true
      }
    }
  ]
};
