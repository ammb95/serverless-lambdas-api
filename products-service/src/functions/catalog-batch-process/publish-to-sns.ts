import AWS from 'aws-sdk';

export const publishToSns = async (sns: AWS.SNS, productInfo: any) => {
  await sns
    .publish({
      Message: JSON.stringify({
        message: 'Product created',
        product: productInfo
      }),
      TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN
    })
    .promise();
};
