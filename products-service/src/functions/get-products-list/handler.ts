import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async () => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const params = {
      TableName: process.env.PRODUCTS_TABLE
    };

    const result = await dynamodb.scan(params).promise();

    const products = result.Items;

    for (const product of products) {
      const stockParams = {
        TableName: process.env.STOCKS_TABLE,
        KeyConditionExpression: 'ProductId = :productId',
        ExpressionAttributeValues: {
          ':productId': product.Id
        }
      };

      const stockResult = await dynamodb.query(stockParams).promise();

      product.Count = stockResult.Items[0]?.Count || 0;
    }

    return formatJSONResponse({
      products
    });
  } catch (error) {
    return formatJSONResponse({
      error: 'Failed to retrieve products',
      status: 500
    });
  }
};

export const main = middyfy(getProductsList);
