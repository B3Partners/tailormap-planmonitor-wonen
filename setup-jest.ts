import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@angular/localize/init';
import './projects/app/src/polyfills';
import '@testing-library/jest-dom';
import failOnConsole from 'jest-fail-on-console';

setupZoneTestEnv();

// Error is thrown because the JSDOM version Jest uses does not support @layer css construct, ignore for now
const allowedErrors = ['Could not parse CSS stylesheet'];
failOnConsole({
  silenceMessage: (msg) => allowedErrors.some(err => msg.includes(err)),
});


