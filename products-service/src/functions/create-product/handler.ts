import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';
import { randomUUID } from 'crypto';
import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async event => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const productId = randomUUID();
    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      Item: { Id: productId, ...event.body }
    };

    await dynamodb.put(params).promise();

    const stockParams = {
      TableName: process.env.STOCKS_TABLE,
      Item: { ProductId: productId, Count: 0 }
    };

    await dynamodb.put(stockParams).promise();

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
