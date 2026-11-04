import { chain, Rule } from '@angular-devkit/schematics';
import { addRootProvider } from '@schematics/angular/utility';
import { Schema } from './schema';

const providerFunctionName = 'planmonitorWonenProvider';
const packageName = '@b3p/planmonitor-wonen';

export function ngAdd(options: Schema): Rule {
  return () => {
    return chain([
      addRootProvider(options.project || 'default', ({ code, external }) => code`${external(providerFunctionName, packageName)}()`),
    ]);
  };
}
