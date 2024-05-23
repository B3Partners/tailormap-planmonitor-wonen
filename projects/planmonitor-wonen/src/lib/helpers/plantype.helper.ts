import { PlantypeEnum } from '../models';

export class PlantypeHelper {

  private static planTypeColors = {
    [PlantypeEnum.PAND_TRANSFORMATIE]: '#aa00ff',
    [PlantypeEnum.TRANSFORMATIEGEBIED]: '#fefe7f',
    [PlantypeEnum.HERSTRUCTURERING]: '#7373ea',
    [PlantypeEnum.VERDICHTING]: '#fec37f',
    [PlantypeEnum.UITBREIDING_UITLEG]: '#81c17f',
    [PlantypeEnum.UITBREIDING_OVERIG]: '#c0c0c0',
  };

  public static getPlantypeColor(plantype: PlantypeEnum | null): string {
    return PlantypeHelper.planTypeColors[plantype || PlantypeEnum.UITBREIDING_UITLEG];
  }

}
