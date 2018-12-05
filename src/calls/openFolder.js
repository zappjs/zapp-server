import Bluebird from 'bluebird';
import { exec } from 'child_process';

export default function openFolder({ body }) {
  return Bluebird.resolve()
    .then(() => {
      exec(`open ${body.cwd}`);
      return {
        body: {}
      };
    })
    .catch((error) => {
      console.log(error);
    });
}
