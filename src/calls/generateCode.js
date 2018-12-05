import Bluebird from 'bluebird';
import { existsSync, mkdirpSync, readFileSync, writeFileSync } from 'fs-extra';
import { dirname, normalize } from 'path';
import zapp from '@zappjs/core';
import { load } from '@zappjs/project';

export default function generateCode({ body }) {
  const data = {};

  return Bluebird.resolve()
    .then(() => {
      // generate items
      const items = zapp(body.project);

      // write generated files to disk
      items.forEach((item) => {
        const itemPath = normalize(`${body.cwd}/${item.path}`);
        if (item.type === 'file') {
          const parentPath = dirname(itemPath);
          if (!existsSync(parentPath)) {
            mkdirpSync(parentPath);
          }
          if (!existsSync(itemPath) || item.content !== readFileSync(itemPath, 'utf-8')) {
            writeFileSync(itemPath, item.content);
          }
        }
      });

      return {
        body: {
          files: data.files
        }
      };
    })
    .catch((error) => {
      console.log(error);
    });
}
