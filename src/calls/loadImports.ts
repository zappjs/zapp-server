import { load, loadImports as loadImportsFromProject } from '@zappjs/project';

export async function loadImports({ body }: any) {
  const project = await load({ dir: body.cwd });
  const imports = await loadImportsFromProject({ imports: project.imports });

  return {
    body: {
      imports
    }
  };
}
