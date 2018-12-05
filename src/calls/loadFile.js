import Bluebird from 'bluebird';
import fs from 'fs';
import path from 'path';

export default function loadFile({ body }) {
  return Bluebird.resolve()
    .then(() => {
      const filePath = path.normalize(`${body.cwd}/${body.path}`);
      const content = fs.readFileSync(filePath, 'utf8');

      return {
        body: {
          content
        }
      };
    });
}
