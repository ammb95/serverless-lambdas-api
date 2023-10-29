import AWS from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { saveProductToDb } from '@libs/save-product-to-db';
import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async event => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const productInfo = event.body;
    await saveProductToDb(dynamodb, productInfo);

    return formatJSONResponse({
      message: 'Item Created',
      status: 201
    });
  } catch (error) {
    return formatJSONResponse({
      error: 'Failed to createProduct',
      status: 500
    });
  }
};

export const main = middyfy(createProduct);
