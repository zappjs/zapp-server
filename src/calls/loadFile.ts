import * as fs from 'fs';
import * as path from 'path';

export async function loadFile({ body }: any) {
  const filePath = path.normalize(`${body.cwd}/${body.path}`);
  const content = fs.readFileSync(filePath, 'utf8');

  return {
    body: {
      content
    }
  };
}
