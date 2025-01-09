import { chain, Rule } from '@angular-devkit/schematics';
import { addRootImport } from '@schematics/angular/utility';
import { Schema } from './schema';

const moduleName = 'PlanmonitorWonenModule';
const packageName = '@b3p/planmonitor-wonen';

export function ngAdd(options: Schema): Rule {
  return () => {
    return chain([
      addRootImport(options.project || 'default', ({ code, external }) => code`${external(moduleName, packageName)}`),
    ]);
  };
}
