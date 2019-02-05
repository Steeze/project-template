import { join, Path } from "@angular-devkit/core";
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url
} from "@angular-devkit/schematics";
import { getWorkspace } from "@schematics/angular/utility/config";

import { Schema as ProjectTemplateOptions } from "../utils/schema";

function deleteFile(host: Tree, path: string) {
  if (host.exists(path)) {
    host.delete(path);
  }
}

function overwriteFiles(path: Path) {
  return (host: Tree) => {
    ["app.module.ts"].forEach(filename => {
      deleteFile(host, join(path, filename));
    });
    return host;
  };
}

export function projectTemplate(options: ProjectTemplateOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = workspace.projects[options.project];
    const sourcePath = join(project.root as Path, "src");
    const appPath = join(sourcePath as Path, "app");

    const rule = chain([
      overwriteFiles(appPath),
      mergeWith(apply(url("./files"), [move(appPath)]), MergeStrategy.Overwrite)
    ]);

    return rule(tree, _context);
  };
}
