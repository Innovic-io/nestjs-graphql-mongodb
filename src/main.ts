// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as multer from 'multer';

import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

import { ApplicationModule } from './app.module';

const app = express();

app.post('/graphql', multer().any(), (req, res, next) => next() );

async function bootstrap() {

  const server = await NestFactory.create(ApplicationModule, app, {});
  await server.listen(process.env.PORT || 3666);
}

bootstrap();
