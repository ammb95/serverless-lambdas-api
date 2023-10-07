import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from '@libs/data.json';
import schema from './schema';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  img: string;
};

const findProduct = (id: string) => (product: Product) => product.id === id;

const getProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async event => {
  const product =
    products.find(findProduct(event.pathParameters.id)) ?? ({} as Product);
  return formatJSONResponse(product);
};

export const main = middyfy(getProduct);
