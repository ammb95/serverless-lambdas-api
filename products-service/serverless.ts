import type { AWS } from '@serverless/typescript';
import getProductById from '@functions/get-product-by-id';
import getProductsList from '@functions/get-products-list';
import createProduct from '@functions/create-product';

const serverlessConfiguration: AWS = {
  service: 'products-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: 'Products',
      STOCKS_TABLE: 'Stocks'
    },
    iam: {
      role: {
        managedPolicies: ['arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess']
      }
    }
  },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Products',
          AttributeDefinitions: [
            {
              AttributeName: 'Id',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'Id',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Stocks',
          AttributeDefinitions: [
            {
              AttributeName: 'ProductId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'ProductId',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      }
    }
  },

  functions: {
    getProductsList,
    getProductById,
    createProduct
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  }
};

module.exports = serverlessConfiguration;
