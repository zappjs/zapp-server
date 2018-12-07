import { load, loadImports as loadImportsFromProject } from '@zappjs/project';

export async function loadImports({ body }: any) {
  const project = await load({ dir: body.cwd });

  if (!project.imports || Object.keys(project.imports).length === 0) {
    return {
      body: {
        imports: []
      }
    };
  }

  const imports = await loadImportsFromProject({ imports: project.imports });

  return {
    body: {
      imports
    }
  };
}
