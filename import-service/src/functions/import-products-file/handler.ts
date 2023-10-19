import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import schema from './schema';
import { BUCKET_NAME } from 'src/constants';
import { getKey } from '@libs/get-key';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async event => {
  if (!event.queryStringParameters.name) {
    return formatJSONResponse({
      message: 'Field "name" is required!'
    });
  }

  const s3 = new S3({
    region: 'us-east-1'
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: getKey(event.queryStringParameters.name),
    Expires: 60,
    ContentType: 'text/csv'
  };

  const signedUrl = s3.getSignedUrl('putObject', params);

  return formatJSONResponse({
    signedUrl
  });
};

export const main = middyfy(importProductsFile);
