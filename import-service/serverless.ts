import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import-products-file';
import importFileParser from '@functions/import-file-parser';
import { BUCKET_ARN, QUEUE_ARN } from 'src/constants';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
    },
    iam: {
      role: {
        managedPolicies: [
          'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          'arn:aws:iam::aws:policy/CloudWatchLogsFullAccess'
        ],
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:ListBucket',
            Resource: [BUCKET_ARN]
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: [`${BUCKET_ARN}/*`]
          },
          {
            Effect: 'Allow',
            Action: ['sqs:SendMessage'],
            Resource: QUEUE_ARN
          }
        ]
      }
    }
  },
  functions: { importProductsFile, importFileParser },
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
