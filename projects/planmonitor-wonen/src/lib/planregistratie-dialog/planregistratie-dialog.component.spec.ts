import { render, screen } from '@testing-library/angular';
import { PlanregistratieDialogComponent } from './planregistratie-dialog.component';

describe('PlanregistratieDialogComponent', () => {

  test('should render', async () => {
    await render(PlanregistratieDialogComponent);
    expect(screen.getByText('planregistratie-dialog works!'));
  });

});
