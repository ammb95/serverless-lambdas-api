import { handlerPath } from '@libs/handler-resolver';
import { AUTHORIZER_ARN } from 'src/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: {
          origins: ['*'],
          headers: ['Authorization', 'Content-Type'],
          allowCredentials: false
        },
        authorizer: {
          arn: AUTHORIZER_ARN,
          type: 'request'
        }
      }
    }
  ]
};
