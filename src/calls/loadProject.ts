import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as glob from 'glob-promise';
import * as path from 'path';
import * as yaml from 'js-yaml';

import { UninitializedError } from '../errors';

export async function loadProject({ body }: any) {
  let project = {};

  const zappDir = path.normalize(`${body.cwd}/.zapp`);

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
