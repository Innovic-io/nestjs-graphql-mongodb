import { GraphQLUpload } from 'apollo-upload-server';

import DateTime from './datetime.scalar';

export const ScalarResolver = {
  DateTime,
  Upload: GraphQLUpload,
};
