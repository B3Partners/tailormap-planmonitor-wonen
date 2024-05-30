import { Component, ChangeDetectionStrategy, TrackByFunction, DestroyRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { PlancategorieModel } from '../models';
import { CategorieTableRowModel } from '../models/categorie-table-row.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ColorHelper } from '../helpers/color.helper';
import { CategorieTableModel } from '../models/categorie-table.model';
import { YearColumnModel } from '../models/year-table-column.model';
import { ColumnHelper } from '../helpers/column.helper';

const INTEGER_REGEX = /^\d+$/;
const ALLOWED_KEYS_FOR_NUMBER_INPUT = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Backspace',
  'Delete',
  'Tab',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
]);

@Component({
  selector: 'lib-plancategorie-list',
  templateUrl: './plancategorie-list.component.html',
  styleUrls: ['./plancategorie-list.component.css'],
  styles: ['mat-table {' +
    `--nieuwbouw-color: ${ColorHelper.getGroupColor('nieuwbouw')};` +
    `--woningtype-color: ${ColorHelper.getGroupColor('woningType')};` +
    `--wonenenzorg-color: ${ColorHelper.getGroupColor('wonenEnZorg')};` +
    `--flexwoningen-color: ${ColorHelper.getGroupColor('flexwoningen')};` +
    `--betaalbaarheid-color: ${ColorHelper.getGroupColor('betaalbaarheid')};` +
    `--sloop-color: ${ColorHelper.getGroupColor('sloop')};` +
  '}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlancategorieListComponent implements OnInit {

  public expanded = false;
  public yearColumns = [ 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042 ];
  public displayedColumns: string[] = ColumnHelper.categorieColumns;
  public displayedColumnsExpanded = ColumnHelper.expandedCategorieColumns;

  public tableData: CategorieTableModel | null = null;
  public trackByRowId: TrackByFunction<CategorieTableRowModel> = (idx, row) => row.id;

  constructor(
    private planregistratieService: PlanregistratiesService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef,
  ) {
  }

  public ngOnInit() {
    this.planregistratieService.getSelectedCategorieTable$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(tableData => {
        this.tableData = tableData;
        this.cdr.detectChanges();
      });
  }

  public updateDetailField($event: Event, id: string, year: number) {
    const { row, value } = this.getRowAndInputValue($event, id);
    if (row === null) {
      return;
    }
    this.planregistratieService.updateDetailplanning(row.groep, row.value, year, value);
  }

  public updateCategorieField($event: Event, id: string, field: keyof PlancategorieModel) {
    const { row, value } = this.getRowAndInputValue($event, id);
    if (row === null) {
      return;
    }
    this.planregistratieService.updateCategorieField(row.groep, row.value, field, value);
  }

  private getRowAndInputValue($event: Event, id: string) {
    const target = $event.target instanceof HTMLInputElement ? $event.target : null;
    if (!target) {
      return { row: null, value: 0 };
    }
    const value = target.value;
    const row = this.tableData?.rows.find(p => p.id === id);
    if (!row) {
      return { row: null, value: 0 };
    }
    if (value !== '' && (!INTEGER_REGEX.test(target.value) || !row || +target.value < 0)) {
      return { row: null, value: 0 };
    }
    return { row, value: value === '' ? 0 : +target.value };
  }

  public toggleExpanded() {
    this.expanded = !this.expanded;
  }

  public createExport() {
    this.planregistratieService.export();
  }

  public handleCellNavigation($event: KeyboardEvent) {
    if (!ALLOWED_KEYS_FOR_NUMBER_INPUT.has($event.key)) {
      $event.preventDefault();
      return;
    }
    if ($event.key !== 'ArrowLeft' && $event.key !== 'ArrowRight' && $event.key !== 'ArrowUp' && $event.key !== 'ArrowDown' || !($event.target instanceof HTMLInputElement)) {
      return;
    }
    const isAtStart = ($event.target.selectionStart == 0);
    const isAtEnd = ($event.target.selectionEnd == $event.target.value.length);
    if ((!isAtEnd && $event.key === 'ArrowRight') || (!isAtStart && $event.key === 'ArrowLeft')) {
      return;
    }
    $event.stopPropagation();
    const column = $event.target.getAttribute('data-column') || 'invalid';
    const row = $event.target.getAttribute('data-row') || '-10';
    const columns = [ 'totaal', 'gerealiseerd', ...this.yearColumns.map(y => `${y}`), '2043' ];
    const colIdx = columns.indexOf(column);
    const targetColIdx = $event.key === 'ArrowLeft' ? colIdx - 1 : ($event.key === 'ArrowRight' ? colIdx + 1 : colIdx);
    const targetRow = $event.key === 'ArrowUp' ? +row - 1 : ($event.key === 'ArrowDown' ? +row + 1 : row);
    const nextTarget = document.querySelector<HTMLInputElement>(`.cell_${columns[targetColIdx]}_${targetRow}`);
    if (nextTarget) {
      nextTarget.focus();
      nextTarget.select();
    }
  }

  public isInvalidColumn(yearColumns: YearColumnModel[], column: string) {
    return !yearColumns.find(c => c.year === column)?.valid;
  }

}
