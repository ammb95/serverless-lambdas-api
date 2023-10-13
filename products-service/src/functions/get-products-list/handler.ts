import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from '@libs/data.json';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async () => {
  return formatJSONResponse({
    products
  });
};

export const main = middyfy(getProductsList);
