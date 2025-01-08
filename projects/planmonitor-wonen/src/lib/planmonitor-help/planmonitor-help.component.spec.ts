import { render, screen } from '@testing-library/angular';
import { PlanmonitorHelpComponent } from './planmonitor-help.component';

describe('PlanmonitorHelpComponent', () => {

  test('should render', async () => {
    await render(PlanmonitorHelpComponent);
    expect(screen.getByText('planmonitor-help works!'));
  });

});
