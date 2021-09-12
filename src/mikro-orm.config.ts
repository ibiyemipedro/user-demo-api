import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  type: 'postgresql',
  host: '127.0.0.1',
  clientUrl: 'postgresql://postgres@127.0.0.1:5432',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  dbName: 'user_app',
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
