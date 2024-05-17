export interface DetailplanningModel {
  plancategorieId: string;
  id: string;
  created: string | Date;
  creator: string;
  editor: string | null;
  edited: string | Date | null;
  jaartal: number;
  aantalGepland: number;
  isNew?: boolean;
}
