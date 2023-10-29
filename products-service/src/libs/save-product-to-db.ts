import { randomUUID } from 'crypto';

export const saveProductToDb = async (
  dynamodb: AWS.DynamoDB.DocumentClient,
  productInfo: any
) => {
  try {
    const productId = randomUUID();
    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      Item: { Id: productId, ...productInfo }
    };

    await dynamodb.put(params).promise();

    const stockParams = {
      TableName: process.env.STOCKS_TABLE,
      Item: { ProductId: productId, Count: 0 }
    };

    await dynamodb.put(stockParams).promise();
  } catch (error) {
    throw error;
  }
};
