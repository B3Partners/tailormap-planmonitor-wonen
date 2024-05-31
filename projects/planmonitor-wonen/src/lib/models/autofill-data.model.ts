import { WoonmilieuAbf13Enum } from './woonmilieu-abf13.enum';

export interface AutofillDataModel {
  woonmilieus: WoonmilieuAbf13Enum[];
  gemeentes: string[];
  provincies: string[];
  regios: string[];
}
