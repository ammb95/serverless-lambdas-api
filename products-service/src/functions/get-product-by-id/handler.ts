import AWS from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async event => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      KeyConditionExpression: 'Id = :id',
      ExpressionAttributeValues: {
        ':id': event.pathParameters.id
      }
    };

    const result = await dynamodb.query(params).promise();

    const product = result.Items[0];

    if (!product) {
      return formatJSONResponse({
        error: 'Product not found',
        status: 404
      });
    }

    const stockParams = {
      TableName: process.env.STOCKS_TABLE,
      KeyConditionExpression: 'ProductId = :productId',
      ExpressionAttributeValues: {
        ':productId': product.Id
      }
    };

    const stockResult = await dynamodb.query(stockParams).promise();

    product.Count = stockResult.Items[0].Count;

    return formatJSONResponse({
      product
    });
  } catch (error) {
    return formatJSONResponse({
      error: 'Failed to retrieve product',
      status: 500
    });
  }
};

export const main = middyfy(getProductById);
