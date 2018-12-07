import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as validator from 'is-my-json-valid';

import { InitializedError, InvalidError, NotFoundError } from '../errors';

import { isDirectory } from '../lib';

interface IBody {
  cwd: string;
}

export async function initialize({ body }: { body: IBody }) {
  const validate = validator({
    type: 'object',
    properties: {
      cwd: {
        required: true,
        type: 'string'
      }
    }
  });

  const isValid = validate(body);

  if (!isValid) {
    throw new InvalidError(
      `"${validate.errors[0].field.substr(5)}" ${validate.errors[0].message}`
    );
  }

  let project = {};

  const cwd = path.normalize(body.cwd);

  if (!fs.existsSync(cwd)) {
    throw new NotFoundError('Directory not found');
  }
  if (fs.lstatSync(cwd).isFile()) {
    throw new NotFoundError('Path is a file');
  }
  if (!isDirectory(cwd)) {
    throw new NotFoundError('Path is not a directory');
  }

  const zappDir = path.normalize(`${cwd}/.zapp`);

  if (fs.existsSync(zappDir)) {
    throw new InitializedError();
  }

  fs.mkdirSync(zappDir);
  
  return {
    body: {
      project
    }
  };
}
