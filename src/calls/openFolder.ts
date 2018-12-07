import { exec } from 'child_process';

export function openFolder({ body }: any) {
  exec(`open ${body.cwd}`);
  return {
    body: {}
  };
}
