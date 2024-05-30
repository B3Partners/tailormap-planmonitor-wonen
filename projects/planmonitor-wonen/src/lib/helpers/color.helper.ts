import { PlantypeEnum } from '../models';

export class ColorHelper {

  private static PLAN_TYPE_COLORS = {
    [PlantypeEnum.PAND_TRANSFORMATIE]: '#aa00ff',
    [PlantypeEnum.TRANSFORMATIEGEBIED]: '#fefe7f',
    [PlantypeEnum.HERSTRUCTURERING]: '#7373ea',
    [PlantypeEnum.VERDICHTING]: '#fec37f',
    [PlantypeEnum.UITBREIDING_UITLEG]: '#81c17f',
    [PlantypeEnum.UITBREIDING_OVERIG]: '#c0c0c0',
  };

  public static GROUP_COLORS = {
    nieuwbouw: '#79eb7a',
    woningType: '#e5f451',
    wonenEnZorg: '#0daee5',
    flexwoningen: '#ff8753',
    betaalbaarheid: '#ffbf3e',
    sloop: '#00b4c5',
  };

  public static getPlantypeColor(plantype: PlantypeEnum | null): string {
    return ColorHelper.PLAN_TYPE_COLORS[plantype || PlantypeEnum.UITBREIDING_UITLEG];
  }

  public static getGroupColor(group: keyof typeof ColorHelper.GROUP_COLORS): string {
    return ColorHelper.GROUP_COLORS[group] || ColorHelper.GROUP_COLORS.nieuwbouw;
  }

}
