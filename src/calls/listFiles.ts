import * as fs from 'fs-extra';
import * as path from 'path';

import { asyncForEach } from '../lib';

interface IFile {
  isEmpty: boolean;
  name: string;
  type: string;
}

async function getFilesRecursive(dir: string, cwd: string): Promise<IFile[]> {
  const items = await fs.readdir(dir);

  let mappedItems: IFile[] = [];
  await asyncForEach(items, async (itemName: string) => {
    const cwdPath = path.normalize(cwd);
    const itemPath = path.normalize(`${dir}/${itemName}`);

    const isDirectory = fs.statSync(itemPath).isDirectory();

    mappedItems.push({
      isEmpty: isDirectory && fs.readdirSync(itemPath).length === 0,
      name: `${dir.substr(cwdPath.length)}/${itemName}`,
      type: isDirectory ? 'dir' : 'file'
    });

    if (isDirectory) {
      const childItems = await getFilesRecursive(itemPath, cwd);
      mappedItems = mappedItems.concat(childItems);
    }
  });
  
  return mappedItems;
}

export async function listFiles({ body }: any) {
  const items = await getFilesRecursive(body.cwd, body.cwd);

  return {
    body: {
      items
    }
  };
}
