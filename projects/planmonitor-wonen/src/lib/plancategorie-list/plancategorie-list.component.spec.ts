import { render, screen } from '@testing-library/angular';
import { PlancategorieListComponent } from './plancategorie-list.component';

describe('PlancategorieListComponent', () => {

  test('should render', async () => {
    await render(PlancategorieListComponent);
    expect(screen.getByText('plancategorie-list works!'));
  });

});
