import bodyParser from 'body-parser';
import express from 'express';

import generateCode from './calls/generateCode';
import listFiles from './calls/listFiles';
import loadFile from './calls/loadFile';
import loadImports from './calls/loadImports';
import loadProject from './calls/loadProject';
import openFolder from './calls/openFolder';
import saveProject from './calls/saveProject';
import writeFiles from './calls/writeFiles';

function handler(method) {
  return (req, res) => {
    return method(req, res)
      .then((result) => {
        res.status(result.code || 200)
          .send(result.body);
      })
      .catch(() => {
        res.status(500)
          .send({});
      });
  };
}

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.get('origin') || 'http://api.alpha.zappjs.com:3001');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,PUT,DELETE,POST,OPTIONS');
  next();
});

app.get('/', (req, res) => {
  res.status(200).send({});
});

app.post('/generateCode', handler(generateCode));
app.post('/listFiles', handler(listFiles));
app.post('/loadFile', handler(loadFile));
app.post('/loadImports', handler(loadImports));
app.post('/loadProject', handler(loadProject));
app.post('/openFolder', handler(openFolder));
app.post('/saveProject', handler(saveProject));
app.post('/writeFiles', handler(writeFiles));

app.listen(12345, () => {
  console.log('listening');
});
