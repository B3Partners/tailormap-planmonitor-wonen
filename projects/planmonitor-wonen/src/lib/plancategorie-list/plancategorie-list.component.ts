import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { PlancategorieHelper } from '../helpers/plancategorie.helper';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { combineLatest, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetailplanningModel, PlancategorieModel, PlanregistratieModel } from '../models';

interface CategorieTableRow {
  id: string;
  cls: string;
  groep: keyof PlancategorieModel;
  value: string;
  label: string;
  groeplabel: string;
  totalen: number;
  total_check: number;
  gerealiseerd: number;
  restcapaciteit: number;
  year_2024: number | string;
  year_2025: number | string;
  year_2026: number | string;
  year_2027: number | string;
  year_2028: number | string;
  year_2029: number | string;
  year_2030: number | string;
  year_2031: number | string;
  year_2032: number | string;
  year_2033: number | string;
  years_check: number;
}

@Component({
  selector: 'lib-plancategorie-list',
  templateUrl: './plancategorie-list.component.html',
  styleUrls: ['./plancategorie-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlancategorieListComponent implements OnInit {

  public yearRange = [ 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033 ];
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
    'years_check',
  ];

  public tableData: CategorieTableRow[] | null = null;
  public trackByRowId: TrackByFunction<CategorieTableRow> = (idx, row) => row.id;

  constructor(
    private planregistratieService: PlanregistratiesService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    combineLatest([
      this.planregistratieService.getSelectedPlanregistratie$(),
      this.planregistratieService.getSelectedPlanCategorieen$(),
      this.planregistratieService.getSelectedDetailplanningen$(),
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(10),
      )
      .subscribe(([ planregistratie, planCategorieen, detailPlanningen ]) => {
        // console.log([ planregistratie, planCategorieen, detailPlanningen ]);
        if (planregistratie === null || planCategorieen === null || detailPlanningen === null) {
          this.tableData = null;
          return;
        }
        this.prepareData(planregistratie, planCategorieen, detailPlanningen);
      });
  }

  private prepareData(planregistratie: PlanregistratieModel, planCategorieen: PlancategorieModel[], detailPlanningen: DetailplanningModel[]) {
    const nieuwbouwCategorie = PlancategorieHelper.getNieuwbouwCategorie(planCategorieen);
    const nieuwbouwTotal = nieuwbouwCategorie?.Totaal_Gepland || 0;
    const groupTotals = new Map<string, number>();
    const rows = PlancategorieHelper.categorieen.map(categorieRow => {
      const planCategorie = PlancategorieHelper.getPlanCategorie(categorieRow, planCategorieen);
      const totalen = planCategorie?.Totaal_Gepland || 0;
      const gerealiseerd = planCategorie?.Totaal_Gerealiseerd || 0;
      const restcapaciteit = totalen - gerealiseerd;
      const row: CategorieTableRow = {
        id: categorieRow.id,
        cls: 'group-' + categorieRow.field.toLowerCase(),
        groep: categorieRow.field,
        value: categorieRow.fieldValue,
        label: categorieRow.label,
        groeplabel: categorieRow.groepnaam,
        totalen,
        total_check: 0,
        gerealiseerd,
        restcapaciteit,
        year_2024: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2024, detailPlanningen) ?? '',
        year_2025: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2025, detailPlanningen) ?? '',
        year_2026: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2026, detailPlanningen) ?? '',
        year_2027: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2027, detailPlanningen) ?? '',
        year_2028: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2028, detailPlanningen) ?? '',
        year_2029: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2029, detailPlanningen) ?? '',
        year_2030: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2030, detailPlanningen) ?? '',
        year_2031: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2031, detailPlanningen) ?? '',
        year_2032: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2032, detailPlanningen) ?? '',
        year_2033: PlancategorieHelper.getDetailplanningGeplandForYear(planCategorie, 2033, detailPlanningen) ?? '',
        years_check: 0,
      };
      const rowTotaal = PlancategorieListComponent.getTotalForRow(row);
      row.years_check = restcapaciteit - rowTotaal;
      groupTotals.set(categorieRow.field, (groupTotals.get(categorieRow.field) || 0) + totalen);
      return row;
    });
    this.tableData = rows.map(row => {
      return {
        ...row,
        total_check: nieuwbouwTotal - (groupTotals.get(row.groep) || 0),
      };
    });
    // console.log(this.tableData);
    this.cdr.detectChanges();
  }

  public updateDetailField($event: Event, id: string, year: number) {
    const target = $event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const row = this.tableData?.find(p => p.id === id);
    if (!row) {
      return;
    }
    this.planregistratieService.updateDetailplanning(row.groep, row.value, year, +target.value);
  }

  public updateCategorieField($event: Event, id: string, field: keyof PlancategorieModel) {
    const target = $event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const row = this.tableData?.find(p => p.id === id);
    if (!row) {
      return;
    }
    this.planregistratieService.updateCategorieField(row.groep, row.value, field, +target.value);
  }

  private static getTotalForRow(row: CategorieTableRow) {
    return (typeof row.year_2024 === 'number' ? row.year_2024 : 0) +
      (typeof row.year_2025 === 'number' ? row.year_2025 : 0) +
      (typeof row.year_2026 === 'number' ? row.year_2026 : 0) +
      (typeof row.year_2027 === 'number' ? row.year_2027 : 0) +
      (typeof row.year_2028 === 'number' ? row.year_2028 : 0) +
      (typeof row.year_2029 === 'number' ? row.year_2029 : 0) +
      (typeof row.year_2030 === 'number' ? row.year_2030 : 0) +
      (typeof row.year_2031 === 'number' ? row.year_2031 : 0) +
      (typeof row.year_2032 === 'number' ? row.year_2032 : 0) +
      (typeof row.year_2033 === 'number' ? row.year_2033 : 0);
  }

}
