import { render, screen } from '@testing-library/angular';
import { PlanregistratieFormComponent } from './planregistratie-form.component';

describe('PlanregistratieFormComponent', () => {

  test('should render', async () => {
    await render(PlanregistratieFormComponent);
    expect(screen.getByText('planregistratie-form works!'));
  });

});
