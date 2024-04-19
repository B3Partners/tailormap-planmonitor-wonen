export interface DetailplanningModel {
  Plancategorie_ID: string;
  ID: string;
  Created: string | Date;
  Creator: string;
  Editor: string | null;
  Edited: string | Date | null;
  Jaartal: number;
  Aantal_Gepland: number;
  IsNew?: boolean;
}
