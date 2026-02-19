
export const COLORS = {
  deepTeal: '#005F73',
  skyBlue: '#94D2BD',
  deepBlue: '#0A2342',
  geoSand: '#E9D8A6',
  premiumGold: '#C9A66B',
  danger: '#EF4444',
  success: '#10B981',
};

export const REGIONS_KSA = [
  'Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir', 'Tabuk', 'Hail', 'Northern Borders', 'Jazan', 'Najran', 'Al-Bahah', 'Al-Jawf', 'Al-Qassim'
];

export const REGIONS_KSA_AR = [
  'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'المنطقة الشرقية', 'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'الجوف', 'القصيم'
];

export interface Device {
  id: number;
  name: string;
  arName: string;
  category: string;
  price: 'High' | 'Mid' | 'Low';
  accuracyClass: 'High' | 'Medium' | 'Entry';
  sensorType: 'RGB' | 'LiDAR' | 'Thermal' | 'Multispectral' | 'GNSS' | 'Optical';
  stock: number;
  leadTimeWeeks?: number; 
  leadTimeLabel?: string;
  availableFrom?: string;
  specs: {
    resolution?: string;
    accuracy: string;
    weight: string;
    batteryLife: string;
  };
}

export const DEVICES: Device[] = [
  { 
    id: 1, 
    name: 'Trimble R12i GNSS', 
    arName: 'جهاز ترنبل R12i GNSS',
    category: 'GNSS', 
    price: 'High', 
    accuracyClass: 'High',
    sensorType: 'GNSS',
    stock: 12,
    leadTimeWeeks: 0,
    specs: { accuracy: '8mm H / 15mm V', weight: '1.12 kg', batteryLife: '6.5 hours' }
  },
  { 
    id: 2, 
    name: 'Leica TS16 Total Station', 
    arName: 'ليكا TS16 المحطة المتكاملة',
    category: 'Total Station', 
    price: 'High', 
    accuracyClass: 'High',
    sensorType: 'Optical',
    stock: 3, 
    leadTimeWeeks: 2,
    leadTimeLabel: '2 weeks',
    specs: { accuracy: '1" angular / 1mm EDM', weight: '5.3 kg', batteryLife: '8 hours' }
  },
  { 
    id: 3, 
    name: 'DJI Matrice 350 RTK + L2', 
    arName: 'دي جي آي ماتريس 350 + L2',
    category: 'UAV LiDAR', 
    price: 'Mid', 
    accuracyClass: 'Medium',
    sensorType: 'LiDAR',
    stock: 7,
    leadTimeWeeks: 1,
    specs: { resolution: '240,000 pts/s', accuracy: '5cm vertical', weight: '3.77 kg', batteryLife: '55 mins' }
  },
  { 
    id: 4, 
    name: 'Topcon GT-1200', 
    arName: 'توبكون GT-1200',
    category: 'Total Station', 
    price: 'Mid', 
    accuracyClass: 'Medium',
    sensorType: 'Optical',
    stock: 0,
    leadTimeWeeks: 6,
    leadTimeLabel: '6-8 Weeks',
    availableFrom: '2024-07-15',
    specs: { accuracy: '1" / 2" / 3"', weight: '5.8 kg', batteryLife: '4 hours' }
  },
  { 
    id: 5, 
    name: 'Emlid Reach RS2+', 
    arName: 'إمليد ريتش RS2+',
    category: 'GNSS', 
    price: 'Low', 
    accuracyClass: 'Entry',
    sensorType: 'GNSS',
    stock: 25,
    specs: { accuracy: '7mm H / 14mm V', weight: '0.95 kg', batteryLife: '16 hours' }
  },
  { 
    id: 6, 
    name: 'Autel EVO II Pro RTK', 
    arName: 'أوتيل إيفو II برو RTK',
    category: 'UAV LiDAR', 
    price: 'Low', 
    accuracyClass: 'Entry',
    sensorType: 'RGB',
    stock: 4,
    leadTimeWeeks: 1,
    leadTimeLabel: '1 Week',
    specs: { resolution: '20MP Sensor', accuracy: '3cm', weight: '1.25 kg', batteryLife: '36 mins' }
  }
];
