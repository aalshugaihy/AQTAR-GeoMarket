
export type Language = 'AR' | 'EN';

export enum UniverseSlug {
  DEVICES = 'devices',
  SERVICES = 'services',
  DATA_PRODUCTS = 'data-products',
  PROJECTS = 'projects'
}

export interface Entity {
  id: string;
  name: string;
  nameAr: string;
  type: 'Service' | 'Provider' | 'Device' | 'Dataset' | 'Project';
  typeAr: 'خدمة' | 'مزود' | 'جهاز' | 'بيانات' | 'مشروع';
  demandScore: number;
  supplyScore: number;
  qualityScore: number;
  trend: 'up' | 'down' | 'stable';
  region: string;
}

export interface MarketSignal {
  id: string;
  title: string;
  titleAr: string;
  impact: 'High' | 'Medium' | 'Low';
  category: string;
  timestamp: string;
}
