export interface NamespaceItem {
  _id: string;
  name: string;
}

export interface RawTranslation {
  _id: string;
  namespace: string;
  key: string;
  translations: {
    ge: string;
    en: string;
  };
}

export interface ExcelRow {
  Namespace?: string;
  namespace?: string;
  Key?: string;
  key?: string;
  Georgian?: string;
  ge?: string;
  English?: string;
  en?: string;
}
