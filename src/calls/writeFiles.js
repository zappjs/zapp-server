import fs from 'fs-extra';
import path from 'path';

export default function writeFiles({ body }) {
  console.log('writeFiles');
  // console.log(body);

  (body.files || []).forEach((file) => {
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
