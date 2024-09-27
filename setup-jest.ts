import 'jest-preset-angular/setup-jest';
import '@angular/localize/init';
import './projects/app/src/polyfills';
import '@testing-library/jest-dom';
import * as failOnConsole from 'jest-fail-on-console';

failOnConsole();

