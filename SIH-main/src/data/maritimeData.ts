import { PortSpec, VesselClassSpec, CommoditySpec } from '../types/freight';

export const COMMODITIES: CommoditySpec[] = [
  { id: 'coal-coking', name: 'Premium Coking Coal', stowageFactor: 44, typicalCargoSize: 100000, category: 'Dry Bulk Coal' },
  { id: 'coal-thermal', name: 'Thermal Coal (NAR 5500)', stowageFactor: 46, typicalCargoSize: 80000, category: 'Dry Bulk Coal' },
  { id: 'iron-ore-fines', name: 'Iron Ore Fines (Fe 62%)', stowageFactor: 21, typicalCargoSize: 120000, category: 'Iron Ore' },
  { id: 'bauxite', name: 'Metallurgical Bauxite', stowageFactor: 32, typicalCargoSize: 75000, category: 'Bauxite' },
  { id: 'grain-wheat', name: 'Milling Wheat', stowageFactor: 48, typicalCargoSize: 55000, category: 'Agri Bulk' },
];

export const ORIGIN_COUNTRIES = [
  { id: 'Australia', name: 'Australia', defaultPort: 'port-hay-point' },
  { id: 'United States', name: 'United States', defaultPort: 'port-baltimore' },
  { id: 'Mozambique', name: 'Mozambique', defaultPort: 'port-maputo' },
  { id: 'Indonesia', name: 'Indonesia', defaultPort: 'port-taboneo' },
  { id: 'Russia', name: 'Russia', defaultPort: 'port-vostochny' },
];

export const PORTS: PortSpec[] = [
  // Origins
  {
    id: 'port-hay-point',
    name: 'Hay Point / Dalrymple Bay',
    country: 'Australia',
    isOrigin: true,
    maxLOA: 300,
    maxBeam: 50,
    maxDraft: 17.5,
    avgHandlingRateTPD: 45000,
    berthCount: 7,
    currentCongestionLevel: 'LOW',
    avgWaitDays: 2.1,
    channelRestrictions: 'Tidal clearance required for Capesize drafts >16m'
  },
  {
    id: 'port-newcastle',
    name: 'Port of Newcastle (PWCS)',
    country: 'Australia',
    isOrigin: true,
    maxLOA: 290,
    maxBeam: 47,
    maxDraft: 15.2,
    avgHandlingRateTPD: 38000,
    berthCount: 8,
    currentCongestionLevel: 'MEDIUM',
    avgWaitDays: 4.5,
  },
  {
    id: 'port-baltimore',
    name: 'Baltimore (CNX Marine)',
    country: 'United States',
    isOrigin: true,
    maxLOA: 260,
    maxBeam: 43,
    maxDraft: 14.5,
    avgHandlingRateTPD: 25000,
    berthCount: 4,
    currentCongestionLevel: 'MEDIUM',
    avgWaitDays: 3.8,
  },
  {
    id: 'port-maputo',
    name: 'Port of Maputo (TCM)',
    country: 'Mozambique',
    isOrigin: true,
    maxLOA: 235,
    maxBeam: 36,
    maxDraft: 13.5,
    avgHandlingRateTPD: 20000,
    berthCount: 3,
    currentCongestionLevel: 'LOW',
    avgWaitDays: 1.5,
  },
  {
    id: 'port-taboneo',
    name: 'Taboneo Anchorage',
    country: 'Indonesia',
    isOrigin: true,
    maxLOA: 250,
    maxBeam: 45,
    maxDraft: 14.0,
    avgHandlingRateTPD: 18000,
    berthCount: 12,
    currentCongestionLevel: 'HIGH',
    avgWaitDays: 6.2,
  },
  {
    id: 'port-vostochny',
    name: 'Vostochny Port',
    country: 'Russia',
    isOrigin: true,
    maxLOA: 290,
    maxBeam: 48,
    maxDraft: 16.0,
    avgHandlingRateTPD: 32000,
    berthCount: 4,
    currentCongestionLevel: 'LOW',
    avgWaitDays: 2.0,
  },

  // Destinations (East Coast Indian Ports)
  {
    id: 'port-paradip',
    name: 'Paradip Port Trust',
    country: 'India',
    isOrigin: false,
    maxLOA: 260,
    maxBeam: 45,
    maxDraft: 14.5,
    avgHandlingRateTPD: 28000,
    berthCount: 14,
    currentCongestionLevel: 'MEDIUM',
    avgWaitDays: 3.2,
    channelRestrictions: 'Panamax fully laden compatible. Capesize requires light-loading or outer anchorage transfer.'
  },
  {
    id: 'port-vizag',
    name: 'Visakhapatnam Port (VPA)',
    country: 'India',
    isOrigin: false,
    maxLOA: 295,
    maxBeam: 48,
    maxDraft: 16.5,
    avgHandlingRateTPD: 32000,
    berthCount: 16,
    currentCongestionLevel: 'LOW',
    avgWaitDays: 2.1,
    channelRestrictions: 'Outer Harbour accommodates Capesize up to 200k DWT.'
  },
  {
    id: 'port-gangavaram',
    name: 'Gangavaram Port',
    country: 'India',
    isOrigin: false,
    maxLOA: 310,
    maxBeam: 50,
    maxDraft: 18.0,
    avgHandlingRateTPD: 35000,
    berthCount: 9,
    currentCongestionLevel: 'LOW',
    avgWaitDays: 1.8,
    channelRestrictions: 'Deepwater all-weather port, fully Capesize compatible.'
  },
  {
    id: 'port-gopalpur',
    name: 'Gopalpur Port',
    country: 'India',
    isOrigin: false,
    maxLOA: 230,
    maxBeam: 36,
    maxDraft: 12.5,
    avgHandlingRateTPD: 16000,
    berthCount: 3,
    currentCongestionLevel: 'LOW',
    avgWaitDays: 1.2,
    channelRestrictions: 'Geared Supramax/Handymax ideal. Draft restricted for Panamax.'
  },
  {
    id: 'port-dhamra',
    name: 'Dhamra Port (Adani)',
    country: 'India',
    isOrigin: false,
    maxLOA: 315,
    maxBeam: 50,
    maxDraft: 17.5,
    avgHandlingRateTPD: 40000,
    berthCount: 6,
    currentCongestionLevel: 'LOW',
    avgWaitDays: 1.4,
    channelRestrictions: 'Deep-draft channel capable of accommodating fully laden Capesize.'
  },
  {
    id: 'port-sagar',
    name: 'Sagar-Sandheads Anchorage',
    country: 'India',
    isOrigin: false,
    maxLOA: 260,
    maxBeam: 45,
    maxDraft: 15.0,
    avgHandlingRateTPD: 14000,
    berthCount: 5,
    currentCongestionLevel: 'HIGH',
    avgWaitDays: 5.5,
    channelRestrictions: 'Floating barge transshipment. Weather and swell sensitive during monsoon.'
  },
  {
    id: 'port-haldia',
    name: 'Haldia Dock Complex (SMP)',
    country: 'India',
    isOrigin: false,
    maxLOA: 195,
    maxBeam: 32,
    maxDraft: 8.5,
    avgHandlingRateTPD: 12000,
    berthCount: 12,
    currentCongestionLevel: 'HIGH',
    avgWaitDays: 6.8,
    channelRestrictions: 'Severe river draft restrictions (max 8.5m). Requires Handysize or top-discharged cargo.'
  }
];

export const VESSEL_CLASSES: VesselClassSpec[] = [
  {
    id: 'Handysize',
    name: 'Handysize Bulk Carrier',
    minDWT: 28000,
    maxDWT: 39000,
    typicalDWT: 35000,
    avgLOA: 180,
    avgBeam: 28,
    avgDraft: 9.5,
    bunkerConsumptionSeaTPD: 18.5,
    bunkerConsumptionPortTPD: 2.5,
    avgSpeedKnots: 13.0,
    dailyCharterBaseRateUSD: 14200,
    co2FactorPerTonFuel: 3.114
  },
  {
    id: 'Supramax',
    name: 'Supramax / Ultramax',
    minDWT: 52000,
    maxDWT: 64000,
    typicalDWT: 58000,
    avgLOA: 199,
    avgBeam: 32.2,
    avgDraft: 11.8,
    bunkerConsumptionSeaTPD: 24.0,
    bunkerConsumptionPortTPD: 3.0,
    avgSpeedKnots: 13.5,
    dailyCharterBaseRateUSD: 17800,
    co2FactorPerTonFuel: 3.114
  },
  {
    id: 'Panamax',
    name: 'Panamax / Kamsarmax',
    minDWT: 70000,
    maxDWT: 85000,
    typicalDWT: 76000,
    avgLOA: 229,
    avgBeam: 32.3,
    avgDraft: 13.8,
    bunkerConsumptionSeaTPD: 29.5,
    bunkerConsumptionPortTPD: 3.8,
    avgSpeedKnots: 14.0,
    dailyCharterBaseRateUSD: 21500,
    co2FactorPerTonFuel: 3.114
  },
  {
    id: 'Capesize',
    name: 'Capesize Bulk Carrier',
    minDWT: 150000,
    maxDWT: 210000,
    typicalDWT: 180000,
    avgLOA: 292,
    avgBeam: 45.0,
    avgDraft: 17.8,
    bunkerConsumptionSeaTPD: 42.0,
    bunkerConsumptionPortTPD: 4.5,
    avgSpeedKnots: 14.2,
    dailyCharterBaseRateUSD: 31000,
    co2FactorPerTonFuel: 3.114
  }
];

export const DISTANCE_MATRIX: Record<string, number> = {
  // Australia Hay Point to Indian East Coast (Nautical Miles)
  'port-hay-point_port-paradip': 4720,
  'port-hay-point_port-vizag': 4680,
  'port-hay-point_port-gangavaram': 4675,
  'port-hay-point_port-gopalpur': 4700,
  'port-hay-point_port-dhamra': 4750,
  'port-hay-point_port-sagar': 4780,
  'port-hay-point_port-haldia': 4810,

  // Australia Newcastle to Indian East Coast
  'port-newcastle_port-paradip': 5120,
  'port-newcastle_port-vizag': 5080,
  'port-newcastle_port-gangavaram': 5075,
  'port-newcastle_port-gopalpur': 5100,
  'port-newcastle_port-dhamra': 5150,
  'port-newcastle_port-sagar': 5180,
  'port-newcastle_port-haldia': 5210,

  // US Baltimore via Cape of Good Hope
  'port-baltimore_port-paradip': 11800,
  'port-baltimore_port-vizag': 11750,

  // Mozambique Maputo
  'port-maputo_port-paradip': 4320,
  'port-maputo_port-vizag': 4280,

  // Indonesia Taboneo
  'port-taboneo_port-paradip': 2450,
  'port-taboneo_port-vizag': 2400,

  // Russia Vostochny
  'port-vostochny_port-paradip': 5100,
  'port-vostochny_port-vizag': 5050,
};
