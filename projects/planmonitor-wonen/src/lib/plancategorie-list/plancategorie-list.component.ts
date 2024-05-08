import { Component, ChangeDetectionStrategy, TrackByFunction, DestroyRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { PlancategorieModel } from '../models';
import { CategorieTableRowModel } from '../models/categorie-table-row.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const INTEGER_REGEX = /^\d+$/;

@Component({
  selector: 'lib-plancategorie-list',
  templateUrl: './plancategorie-list.component.html',
  styleUrls: ['./plancategorie-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlancategorieListComponent implements OnInit {

  public expanded = false;

  public yearColumns = [ 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042 ];

  public displayedColumns: string[] = [
    'label',
    'groeplabel',
    'totalen',
    'total_check',
    'gerealiseerd',
    'restcapaciteit',
    'year_2024',
    'year_2025',
    'year_2026',
    'year_2027',
    'year_2028',
    'year_2029',
    'year_2030',
    'year_2031',
    'year_2032',
    'year_2033',
    'year_2034_2038',
    'year_2039_2043',
    'years_check',
  ];

  public displayedColumnsExpanded = [
    ...this.displayedColumns.slice(0, -3),
    'year_2034',
    'year_2035',
    'year_2036',
    'year_2037',
    'year_2038',
    'year_2039',
    'year_2040',
    'year_2041',
    'year_2042',
    'year_2043',
    'years_check',
  ];


  public tableData: CategorieTableRowModel[] | null = null;
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
    const target = $event.target;
    const row = this.tableData?.find(p => p.id === id);
    if (!(target instanceof HTMLInputElement) || !INTEGER_REGEX.test(target.value) || !row) {
      return { row: null, value: 0 };
    }
    return { row, value: +target.value };
  }

  public toggleExpanded() {
    this.expanded = !this.expanded;
  }

}
