import { Product } from './product.model';

export const mapRowToProduct = (row: any): Product => {
  const inputString = Object.values(row)[0] as string;

  const [title, description, image, price] = inputString.split(',');

  return {
    Title: title,
    Description: description,
    Image: image,
    Price: Number(price)
  };
};
