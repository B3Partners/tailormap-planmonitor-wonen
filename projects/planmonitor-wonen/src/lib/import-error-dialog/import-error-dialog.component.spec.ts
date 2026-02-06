import { render, screen } from '@testing-library/angular';
import { ImportErrorDialogComponent } from './import-error-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('ImportErrorDialogComponent', () => {
  const renderComponent = async (errors: string[]) => {
    const close = jest.fn();
    const renderResult = await render(ImportErrorDialogComponent, {
      declarations: [ImportErrorDialogComponent],
      imports: [ MatDialogModule, MatButtonModule ],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { errors } },
      ],
    });
    return {
      renderResult,
      close,
    };
  };

  it('should create', async () => {
    const { renderResult } = await renderComponent(['Error 1']);
    expect(renderResult.fixture.componentInstance).toBeTruthy();
  });

  it('should display errors from dialog data', async () => {
    const errors = [ 'Error 1', 'Error 2', 'Error 3' ];
    await renderComponent(errors);

    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
    expect(screen.getByText('Error 3')).toBeInTheDocument();
  });

  it('should display message when no errors', async () => {
    await renderComponent([]);

    expect(screen.getByText('Geen fouten gevonden.')).toBeInTheDocument();
  });

  it('should close dialog when close button is clicked', async () => {
    const { renderResult, close } = await renderComponent(['Error 1']);
    renderResult.fixture.componentInstance.close();
    expect(close).toHaveBeenCalled();
  });

  it('should open dialog with correct configuration', () => {
    const mockDialog = {
      open: jest.fn(),
    } as any;
    const errors = ['Test error'];
    ImportErrorDialogComponent.open(mockDialog, errors);
    expect(mockDialog.open).toHaveBeenCalledWith(ImportErrorDialogComponent, {
      width: '600px',
      data: { errors },
    });
  });

  it('should display correct title', async () => {
    await renderComponent(['Error 1']);
    expect(screen.getByRole('heading', { name: 'Fouten bij importeren' })).toBeInTheDocument();
  });

  it('should display multiple errors in a list', async () => {
    const errors = [
      'File format invalid',
      'Missing required field: name',
      'Date format incorrect',
    ];
    await renderComponent(errors);
    expect(screen.getByText('De volgende fouten zijn opgetreden tijdens het importeren:')).toBeInTheDocument();
    expect(screen.getByText('File format invalid')).toBeInTheDocument();
    expect(screen.getByText('Missing required field: name')).toBeInTheDocument();
    expect(screen.getByText('Date format incorrect')).toBeInTheDocument();
  });
});
