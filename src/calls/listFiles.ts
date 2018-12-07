import * as fs from 'fs-extra';
import * as path from 'path';

export async function listFiles({ body }: any) {
  const items = await fs.readdir(body.cwd);
  const mappedItems = items
    .map((itemName) => {
      const itemPath = path.normalize(`${body.cwd}/${itemName}`);

      const isDirectory = fs.statSync(itemPath).isDirectory();

      return {
        isEmpty: isDirectory && fs.readdirSync(itemPath).length === 0,
        name: itemName,
        type: isDirectory ? 'dir' : 'file'
      };
    });

  return {
    body: {
      items: mappedItems
    }
  };
}
