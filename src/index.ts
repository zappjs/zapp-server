import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Request, Response } from 'express';

import {
  generateCode,
  initialize,
  listFiles,
  loadFile,
  loadImports,
  loadProject,
  openFolder,
  saveProject,
  writeFiles
} from './calls';

function handler(method: any) {
  return async (req: Request, res: Response) => {
    try {
      const response = await method(req, res);
      const code = response.code || 200;
      const responseBody = response.body;

      // console.log(responseBody);

      res
        .status(code)
        .send(responseBody);

    } catch (error) {
      const code = error.code || 500;
      const message = error.message || 'Internal server error';
      const responseBody = {
        type: error.type,
        message
      };

      // console.log(responseBody);

      res
        .status(code)
        .send(responseBody);
    }
  };
}

export async function init(cb?: Function) {
  const app = express();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use((req, res, next) => {
    const origin = req.get('origin');
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,PUT,DELETE,POST,OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  app.get('/', (req, res) => {
    res.status(200).send({});
  });

  app.post('/generateCode', handler(generateCode));
  app.post('/initialize', handler(initialize));
  app.post('/listFiles', handler(listFiles));
  app.post('/loadFile', handler(loadFile));
  app.post('/loadImports', handler(loadImports));
  app.post('/loadProject', handler(loadProject));
  app.post('/openFolder', handler(openFolder));
  app.post('/saveProject', handler(saveProject));
  app.post('/writeFiles', handler(writeFiles));

  const server = app.listen(12345, cb);

  return server;
}