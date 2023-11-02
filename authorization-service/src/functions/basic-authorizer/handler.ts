import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { getCredentials, getIsAuthorized, getResponse } from './utils';

const basicAuthorizer = async (event: APIGatewayRequestAuthorizerEvent) => {
  try {
    const { headers, methodArn } = event;

    const { Authorization: authToken } = headers;

    if (!authToken)
      return {
        statusCode: 401,
        message: 'Authorization Header Not Provided'
      };

    const credentials = getCredentials(authToken);

    const isAuthorized = getIsAuthorized(credentials);

    if (!isAuthorized)
      return {
        statusCode: 403,
        message: 'Invalid Authorization Header'
      };

    return getResponse(credentials, isAuthorized, methodArn);
  } catch (error) {
    console.log(error);
  }
};

export const main = basicAuthorizer;
