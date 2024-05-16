import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import {
  DrawingEnableToolArguments,
  DrawingToolConfigModel, DrawingToolModel, MapService, MapStyleModel, ModifyEnableToolArguments, ModifyToolConfigModel, ModifyToolModel,
  SelectToolConfigModel, SelectToolModel, ToolTypeEnum,
} from '@tailormap-viewer/map';
import { combineLatest, distinctUntilChanged, map, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { PlanregistratieModel, PlantypeEnum } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlanregistratiesService } from '../services/planregistraties.service';
import { CssHelper } from '@tailormap-viewer/shared';
import { FeatureModel } from '@tailormap-viewer/api';
import { PlantypeHelper } from '../helpers/plantype.helper';

type PlanregistratieFeatureAttributes = Omit<PlanregistratieModel, 'geometrie'> & { selected?: boolean };

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
  private addFeatureTool: DrawingToolModel | undefined;

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
    this.createAddFeatureTool();
    this.toggleTools();
  }

  private renderFeatures() {
    const planregistratieFeatures$: Observable<FeatureModel<PlanregistratieFeatureAttributes>[]> = combineLatest([
      this.planregistratieService.getPlanregistraties$(),
      this.planregistratieService.getSelectedPlanregistratie$(),
    ])
      .pipe(map(([ registraties, selectedPlan ]) => registraties.map(registratie => {
        const planRegistratie = selectedPlan !== null && selectedPlan.id === registratie.id
          ? selectedPlan
          : registratie;
        const { geometrie, ...attributes } = planRegistratie;
        return {
          __fid: planRegistratie.id,
          geometry: geometrie,
          attributes: { ...attributes, selected: planRegistratie.id === selectedPlan?.id },
        };
      })));
    this.mapService.renderFeatures$<PlanregistratieFeatureAttributes>(
      PlanregistratiesMapComponent.LAYER_ID,
      planregistratieFeatures$,
      feature => PlanregistratiesMapComponent.getFeatureStyle(feature.attributes.plantype, feature.attributes.selected),
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private createSelectTool() {
    this.mapService.createTool$<SelectToolModel<PlanregistratieFeatureAttributes>, SelectToolConfigModel<PlanregistratieFeatureAttributes>>({
      type: ToolTypeEnum.Select,
      layers: [PlanregistratiesMapComponent.LAYER_ID],
      style: feature => PlanregistratiesMapComponent.getFeatureStyle(feature.attributes.plantype, true),
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
        this.planregistratieService.setSelectedPlanregistratie(selectedPlan?.id || null);
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

  private createAddFeatureTool() {
    this.mapService.createTool$<DrawingToolModel, DrawingToolConfigModel>({
      type: ToolTypeEnum.Draw,
      style: PlanregistratiesMapComponent.getFeatureStyle(PlantypeEnum.UITBREIDING_OVERIG),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ tool }) => this.addFeatureTool = tool),
        switchMap(({ tool }) => tool.drawEnd$),
      )
      .subscribe(drawEvent => {
        this.planregistratieService.setNewFeatureGeometry(drawEvent.geometry);
      });
  }

  private toggleTools() {
    this.planregistratieService.getSelectedPlanregistratie$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged((prev, current) => prev?.id === current?.id),
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
            geometry: selectedPlan.geometrie,
            style: PlanregistratiesMapComponent.getFeatureStyle(selectedPlan.plantype, true),
          });
        }
      });
    this.planregistratieService.isCreatingNewPlan$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        withLatestFrom(this.mapService.getToolManager$()),
      )
      .subscribe(([ isCreatingNew, toolManager ]) => {
        if (!this.addFeatureTool || !this.selectTool) {
          return;
        }
        if (isCreatingNew) {
          toolManager.disableTool(this.selectTool.id, true);
          toolManager.enableTool<DrawingEnableToolArguments>(this.addFeatureTool.id, true, { type: 'area' });
        } else {
          toolManager.disableTool(this.addFeatureTool.id, true);
          toolManager.enableTool(this.selectTool.id, false);
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

  private static getFeatureStyle(planType: PlantypeEnum, selected = false): MapStyleModel {
    // const selected = attributes.selected || alwaysHighlighted;
    return {
      zIndex: selected ? 9999 : 9998,
      strokeColor: selected ? PlanregistratiesMapComponent.PRIMARY_COLOR : 'rgb(0, 0, 0)',
      strokeWidth: selected ? 6 : 1,
      fillColor: PlantypeHelper.getPlantypeColor(planType),
      fillOpacity: 50,
      pointType: 'square',
      pointFillColor: PlantypeHelper.getPlantypeColor(planType),
      styleKey: 'planmonitor-highlight-style',
    };
  }

}
