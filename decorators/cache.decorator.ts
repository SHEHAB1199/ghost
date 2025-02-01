import { SetMetadata } from '@nestjs/common';

export const CACHE_METADATA_KEY = 'cache_metadata';

export const Cache = (maxAge: number) =>
  SetMetadata(CACHE_METADATA_KEY, maxAge);
