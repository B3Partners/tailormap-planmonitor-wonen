import 'jest-preset-angular/setup-jest';
import './projects/app/src/polyfills';
import '@testing-library/jest-dom';

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));
