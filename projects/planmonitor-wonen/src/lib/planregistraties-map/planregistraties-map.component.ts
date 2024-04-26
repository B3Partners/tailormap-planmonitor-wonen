import { Component, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import {
  MapService, MapStyleModel, ModifyEnableToolArguments, ModifyToolConfigModel, ModifyToolModel, SelectToolConfigModel, SelectToolModel,
  ToolTypeEnum,
} from '@tailormap-viewer/map';
import { combineLatest, distinctUntilChanged, map, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
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
  private modifyTool: ModifyToolModel | undefined;

  constructor(
    private planregistratieService: PlanregistratiesService,
    private mapService: MapService,
    private destroyRef: DestroyRef,
  ) { }

  public ngOnInit(): void {
    PlanregistratiesMapComponent.PRIMARY_COLOR = CssHelper.getCssVariableValue('--primary-color').trim();
    this.renderFeatures();
    this.createSelectTool();
    this.createModifyTool();
    this.toggleTools();
  }

  private renderFeatures() {
    const planregistratieFeatures$: Observable<FeatureModel<PlanregistratieFeatureAttributes>[]> = combineLatest([
      this.planregistratieService.getPlanregistraties$(),
      this.planregistratieService.getSelectedPlanregistratie$(),
    ])
      .pipe(map(([ registraties, selectedPlan ]) => registraties.map(registratie => {
        const planRegistratie = selectedPlan !== null && selectedPlan.ID === registratie.ID
          ? selectedPlan
          : registratie;
        const { GEOM, ...attributes } = planRegistratie;
        return {
          __fid: planRegistratie.ID,
          geometry: GEOM,
          attributes: { ...attributes, selected: planRegistratie.ID === selectedPlan?.ID },
        };
      })));
    this.mapService.renderFeatures$<PlanregistratieFeatureAttributes>(
      PlanregistratiesMapComponent.LAYER_ID,
      planregistratieFeatures$,
      feature => PlanregistratiesMapComponent.getFeatureStyle(feature.attributes),
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private createSelectTool() {
    this.mapService.createTool$<SelectToolModel<PlanregistratieFeatureAttributes>, SelectToolConfigModel<PlanregistratieFeatureAttributes>>({
      type: ToolTypeEnum.Select,
      layers: [PlanregistratiesMapComponent.LAYER_ID],
      style: feature => PlanregistratiesMapComponent.getFeatureStyle(feature.attributes, true),
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

  private createModifyTool() {
    this.mapService.createTool$<ModifyToolModel, ModifyToolConfigModel>({ type: ToolTypeEnum.Modify })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ tool }) => {
          this.modifyTool = tool;
        }),
        switchMap(({ tool }) => tool.featureModified$),
      )
      .subscribe(updatedGeometry => {
        this.planregistratieService.setSelectedPlanregistratieGeometry(updatedGeometry);
      });
  }

  private toggleTools() {
    this.planregistratieService.getSelectedPlanregistratie$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged((prev, current) => prev?.ID === current?.ID),
        withLatestFrom(this.mapService.getToolManager$()),
      )
      .subscribe(([ selectedPlan, toolManager ]) => {
        if (!this.modifyTool || !this.selectTool) {
          return;
        }
        if (!selectedPlan) {
          toolManager.disableTool(this.modifyTool.id, true);
          toolManager.enableTool(this.selectTool.id, true);
        } else {
          toolManager.disableTool(this.modifyTool.id, true);
          toolManager.enableTool<ModifyEnableToolArguments>(this.modifyTool.id, false, {
            geometry: selectedPlan.GEOM,
            style: PlanregistratiesMapComponent.getFeatureStyle(selectedPlan, true),
          });
        }
      });
    this.planregistratieService.hasChanges$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        withLatestFrom(this.mapService.getToolManager$()),
      )
      .subscribe(([ hasChanges, toolManager ]) => {
        if (!this.selectTool) {
          return;
        }
        if (hasChanges) {
          toolManager.disableTool(this.selectTool.id, true);
        } else {
          toolManager.enableTool(this.selectTool.id, false);
        }
      });
  }

  private static getFeatureStyle(attributes: PlanregistratieFeatureAttributes, alwaysHighlighted = false): MapStyleModel {
    const selected = attributes.selected || alwaysHighlighted;
    return {
      zIndex: selected ? 9999 : 9998,
      strokeColor: selected ? PlanregistratiesMapComponent.PRIMARY_COLOR : 'rgb(0, 0, 0)',
      strokeWidth: selected ? 6 : 1,
      fillColor: PlantypeHelper.getPlantypeColor(attributes.Plantype),
      fillOpacity: 50,
      pointType: 'square',
      pointFillColor: PlantypeHelper.getPlantypeColor(attributes.Plantype),
      styleKey: 'planmonitor-highlight-style',
    };
  }

}
