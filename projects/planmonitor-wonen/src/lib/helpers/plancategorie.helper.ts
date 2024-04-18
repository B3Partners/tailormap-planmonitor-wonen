import { PlancategorieModel } from '../models';

export class PlancategorieHelper {

  public static categorieen: Array<{ label: string; groepnaam: string; field?: keyof PlancategorieModel }> = [
    { label: 'Nieuwbouw', groepnaam: 'nieuwbouw' },
    { label: 'Eengezins', groepnaam: 'woningtype', field: 'Woningtype' },
    { label: 'Meergezins', groepnaam: 'woningtype', field: 'Woningtype' },
    { label: 'Onbekend', groepnaam: 'woningtype', field: 'Woningtype' },
    { label: 'Nultreden', groepnaam: 'wonen en zorg', field: 'Levensloop_Bestendigheid' },
    { label: 'Geclusterd', groepnaam: 'wonen en zorg', field: 'Levensloop_Bestendigheid' },
    { label: 'Zorggeschikt', groepnaam: 'wonen en zorg', field: 'Levensloop_Bestendigheid' },
    { label: 'Onbekend', groepnaam: 'wonen en zorg', field: 'Levensloop_Bestendigheid' },
    { label: 'Regulier', groepnaam: 'wonen en zorg', field: 'Levensloop_Bestendigheid' },
    { label: 'Flexwoningen', groepnaam: 'flexwoningen' },
    { label: 'Regulier permanent', groepnaam: 'flexwoningen' },
    { label: 'Sociale huur', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid' },
    { label: 'Huur middenhuur', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid' },
    { label: 'Huur dure huur', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid' },
    { label: 'Huur onbekend', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid' },
    { label: 'Koop betaalbare koop', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid' },
    { label: 'Koop dure koop', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid' },
    { label: 'Koop onbekend', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid' },
    { label: 'Onbekend Koop of Huur', groepnaam: 'betaalbaarheid', field: 'Betaalbaarheid' },
    { label: 'Sloop', groepnaam: 'sloop' },
  ];

}
