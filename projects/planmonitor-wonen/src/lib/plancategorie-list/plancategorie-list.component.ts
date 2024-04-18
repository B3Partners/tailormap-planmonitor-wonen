import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { PlancategorieHelper } from '../helpers/plancategorie.helper';

@Component({
  selector: 'lib-plancategorie-list',
  templateUrl: './plancategorie-list.component.html',
  styleUrls: ['./plancategorie-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlancategorieListComponent implements OnInit {

  public yearRange = [ 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033 ];
  public yearColumns = this.yearRange.map(PlancategorieListComponent.getColumnForYear);
  public displayedColumns: string[] = [
    'categorie',
    'groepnaam',
    'totalen',
    'total_check',
    'gerealiseerd',
    'restcapaciteit',
    ...this.yearColumns,
    'years_check',
  ];

  public tableData: Record<string, string | number>[] = [];
  public trackByRowId: TrackByFunction<Record<string, string | number>> = (idx, row) => row['id'];

  constructor() { }

  public ngOnInit(): void {
    this.prepareData();
  }

  private prepareData() {
    this.tableData = PlancategorieHelper.categorieen.map((category, idx) => {
      const row: Record<string, string | number> = {
        id: idx,
        cls: 'group-' + category.groepnaam.replace(/ /g, '-'),
        categorie: category.label,
        groepnaam: category.groepnaam,
        totalen: 0,
        total_check: 0,
        gerealiseerd: 0,
        restcapaciteit: 0,
        years_check: 0,
      };
      this.yearRange.forEach(year => {
        row[PlancategorieListComponent.getColumnForYear(year)] = 0;
      });
      return row;
    });
  }

  private static getColumnForYear(year: number) {
    return `year_${year}`;
  }

  public updateField($event: Event, id: number, year: number) {
    const target = $event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const row = this.tableData.find(p => p['id'] === id);
    const categorie = row ? row['categorie'] : '';
    console.log('value ', target.value, 'categorie', categorie, 'year', year);
  }

}
