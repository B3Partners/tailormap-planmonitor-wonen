export interface DetailplanningModel {
  id: string;
  plancategorieId: string;
  creator: string;
  createdAt: string | Date;
  editor: string | null;
  editedAt: string | Date | null;
  jaartal: number;
  aantalGepland: number;
}
