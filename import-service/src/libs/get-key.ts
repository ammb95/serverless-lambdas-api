import { FOLDER_NAME } from 'src/constants';

export const getKey = (name: string) => `${FOLDER_NAME}/${name}`;
