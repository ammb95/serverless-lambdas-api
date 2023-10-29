import AWS from 'aws-sdk';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { saveProductToDb } from '@libs/save-product-to-db';
import { publishToSns } from './publish-to-sns';

const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const sns = new AWS.SNS();
  for (const { body } of event.Records) {
    try {
      const productInfo = JSON.parse(body);
      await saveProductToDb(dynamodb, productInfo);
      await publishToSns(sns, productInfo);
    } catch (error) {
      console.log('Failed to createProduct', error);
    }
  }
};

export const main = catalogBatchProcess;
