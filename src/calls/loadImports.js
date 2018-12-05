import Bluebird from 'bluebird';
import { load, loadImports } from '@zappjs/project';

export default function loadImportsCall({ body }) {
  return Bluebird.resolve()
    .then(() => {
      return load({ dir: body.cwd });
    })
    .then((project) => {
      return loadImports({ imports: project.imports });
    })
    .then((imports) => {
      console.log(imports);
      return {
        body: {
          imports
        }
      };
    })
    .catch((error) => {
      console.log(error);
    });
}
