import { existsSync, mkdirpSync, readFileSync, writeFileSync } from 'fs-extra';
import { dirname, normalize } from 'path';
import zapp from '@zappjs/core';

export async function generateCode({ body }: any) {
  const data: any = {
    files: {}
  };

  // generate items
  const items = zapp(body.project);

  // write generated files to disk
  items.forEach((item: any) => {
    const itemPath = normalize(`${body.cwd}/${item.path}`);
    if (item.type === 'file') {
      data.files[item.path] = item.content;

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
}
