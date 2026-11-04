import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { ErrorListDialogComponent, ErrorListDialogData } from './error-list-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('ErrorListDialogComponent', () => {
  const dialogData = (errors: string[]): ErrorListDialogData => ({
    title: 'Fouten bij importeren',
    description: 'De volgende fouten zijn opgetreden tijdens het importeren:',
    errors,
  });

  const renderComponent = async (errors: string[]) => {
    const close = vi.fn();
    const renderResult = await render(ErrorListDialogComponent, {
      declarations: [ErrorListDialogComponent],
      imports: [ MatDialogModule, MatButtonModule ],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: dialogData(errors) },
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
      open: vi.fn(),
    } as any;
    const data = dialogData(['Test error']);
    ErrorListDialogComponent.open(mockDialog, data);
    expect(mockDialog.open).toHaveBeenCalledWith(ErrorListDialogComponent, {
      width: '600px',
      data,
    });
  });

  it('should display title', async () => {
    await renderComponent(['Error 1']);
    expect(screen.getByRole('heading', { name: 'Fouten bij importeren' })).toBeInTheDocument();
  });

  it('should display description and multiple errors in a list', async () => {
    const errors = [
      'File format invalid',
      'Missing required field: name',
      'Date format incorrect',
    ];
    await renderComponent(errors);
    expect(screen.getByText('De volgende fouten zijn opgetreden tijdens het importeren:')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').map(li => li.textContent?.trim())).toEqual(errors);
  });
});
