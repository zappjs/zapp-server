import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as glob from 'glob-promise';
import * as path from 'path';
import * as validator from 'is-my-json-valid';
import * as yaml from 'js-yaml';

import { InvalidError, NotFoundError, UninitializedError } from '../errors';

interface IBody {
  cwd: string;
}

export async function loadProject({ body }: { body: IBody }) {
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

  const zappDir = path.normalize(`${cwd}/.zapp`);

  if (!fs.existsSync(zappDir)) {
    throw new UninitializedError();
  }

  const items = await glob(
    '.zapp/**/*',
    {
      cwd: body.cwd,
      dot: true,
      nodir: true
    }
  );

  items.forEach((item: string) => {
    const itemPathParts = item.replace(/\.ya?ml$/, '').split('/');
    const itemPath = path.normalize(`${body.cwd}/${item}`);
    const itemValue = fs.readFileSync(itemPath, 'utf8');

    if (/\.ya?ml$/.test(item)) {
      project = _.set(project, itemPathParts.slice(1), yaml.safeLoad(itemValue));
    } else {
      project = _.set(project, itemPathParts.slice(1), itemValue);
    }
  });
  
  return {
    body: {
      project
    }
  };
}
