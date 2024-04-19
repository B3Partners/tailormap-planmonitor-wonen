import { Component, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { MapService, MapStyleModel, SelectToolConfigModel, SelectToolModel, ToolTypeEnum } from '@tailormap-viewer/map';
import { combineLatest, map, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { PlanregistratieModel } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { CssHelper } from '@tailormap-viewer/shared';
import { FeatureModel } from '@tailormap-viewer/api';
import { PlantypeHelper } from '../helpers/plantype.helper';

type PlanregistratieFeatureAttributes = Omit<PlanregistratieModel, 'GEOM'> & { selected?: boolean };

@Component({
  selector: 'lib-planregistraties-map',
  templateUrl: './planregistraties-map.component.html',
  styleUrls: ['./planregistraties-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanregistratiesMapComponent implements OnInit {

  private static LAYER_ID = 'planregistraties-layer';
  private static PRIMARY_COLOR = '';
  private selectTool: SelectToolModel | undefined;

  constructor(
    private planregistratieService: PlanregistratiesService,
    private mapService: MapService,
    private destroyRef: DestroyRef,
  ) { }

  public ngOnInit(): void {
    PlanregistratiesMapComponent.PRIMARY_COLOR = CssHelper.getCssVariableValue('--primary-color').trim();
    this.renderFeatures();
    this.createSelectTool();
    // this.toggleSelectTool();
  }

  private renderFeatures() {
    const planregistratieFeatures$: Observable<FeatureModel<PlanregistratieFeatureAttributes>[]> = combineLatest([
      this.planregistratieService.getPlanregistraties$(),
      this.planregistratieService.getSelectedPlanregistratie$(),
    ])
      .pipe(map(([ registraties, selectedPlan ]) => registraties.map(registratie => {
        const { GEOM, ...attributes } = registratie;
        return {
          __fid: registratie.ID,
          geometry: GEOM,
          attributes: { ...attributes, selected: registratie.ID === selectedPlan?.ID },
        };
      })));
    this.mapService.renderFeatures$<PlanregistratieFeatureAttributes>(
      PlanregistratiesMapComponent.LAYER_ID,
      planregistratieFeatures$,
      feature => PlanregistratiesMapComponent.getFeatureStyle(feature),
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private createSelectTool() {
    this.mapService.createTool$<SelectToolModel<PlanregistratieFeatureAttributes>, SelectToolConfigModel<PlanregistratieFeatureAttributes>>({
      type: ToolTypeEnum.Select,
      layers: [PlanregistratiesMapComponent.LAYER_ID],
      style: feature => PlanregistratiesMapComponent.getFeatureStyle(feature, true),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ tool, manager }) => {
          this.selectTool = tool;
          manager.enableTool(tool.id, true);
        }),
        switchMap(({ tool }) => tool.selectedFeatures$),
      )
      .subscribe(selectedFeatures => {
        const selectedPlan = selectedFeatures && selectedFeatures.length > 0 && selectedFeatures[0] ? selectedFeatures[0].attributes : null;
        this.planregistratieService.setSelectedPlanregistratie(selectedPlan?.ID || null);
      });
  }

  private toggleSelectTool() {
    this.planregistratieService.getSelectedPlanregistratie$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(this.mapService.getToolManager$()),
      )
      .subscribe(([ plan, toolManager ]) => {
        if (!this.selectTool) {
          return;
        }
        if (plan) {
          toolManager.disableTool(this.selectTool.id);
        } else {
          toolManager.enableTool(this.selectTool.id, true);
        }
      });
  }

  private static getFeatureStyle(feature: FeatureModel<PlanregistratieFeatureAttributes>, alwaysHighlighted = false): MapStyleModel {
    const selected = feature.attributes.selected || alwaysHighlighted;
    return {
      zIndex: selected ? 9999 : 9998,
      strokeColor: selected ? PlanregistratiesMapComponent.PRIMARY_COLOR : 'rgb(0, 0, 0)',
      strokeWidth: selected ? 6 : 1,
      fillColor: PlantypeHelper.getPlantypeColor(feature.attributes.Plantype),
      fillOpacity: 50,
      pointType: 'square',
      pointFillColor: PlantypeHelper.getPlantypeColor(feature.attributes.Plantype),
      styleKey: 'planmonitor-highlight-style',
    };
  }

}
