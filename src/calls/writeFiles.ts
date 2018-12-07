import * as fs from 'fs-extra';
import * as path from 'path';

export function writeFiles({ body }: any) {
  console.log('writeFiles');
  // console.log(body);

  (body.files || []).forEach((file: any) => {
    const filePath = path.normalize(`${body.cwd}/${file.path}`);
    const fileDir = path.dirname(filePath);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirpSync(fileDir);
    }
    if (file.type === 'directory') {
      if (!fs.existsSync(filePath)) {
        fs.mkdirpSync(filePath);
      }
      return;
    }
    const currentFile = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, 'utf8')
      : '';
    if (currentFile !== file.content) {
      fs.writeFileSync(filePath, file.content);
    }
  });
}
