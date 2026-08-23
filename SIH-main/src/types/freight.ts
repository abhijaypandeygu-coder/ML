export type MarketRegimeType = 'RISING' | 'FALLING' | 'STABLE' | 'HIGH_VOLATILITY';
export type VesselClassType = 'Handysize' | 'Supramax' | 'Panamax' | 'Capesize';
export type ContractStrategyType = 'SPOT' | 'SHORT_TERM' | 'MEDIUM_TERM_MULTI';
export type RiskLevelType = 'LOW' | 'MEDIUM' | 'HIGH';
export type CompatibilityStatus = 'PASS' | 'WARNING' | 'INCOMPATIBLE';

export interface CommoditySpec {
  id: string;
  name: string;
  stowageFactor: number; // cuft/MT
  typicalCargoSize: number; // MT
  category: 'Dry Bulk Coal' | 'Iron Ore' | 'Bauxite' | 'Agri Bulk' | 'Fertilizers';
}

export interface PortSpec {
  id: string;
  name: string;
  country: string;
  isOrigin: boolean;
  maxLOA: number; // meters
  maxBeam: number; // meters
  maxDraft: number; // meters
  avgHandlingRateTPD: number; // Tons Per Day loading/discharging
  berthCount: number;
  currentCongestionLevel: RiskLevelType;
  avgWaitDays: number;
  channelRestrictions?: string;
  tidalWindowRequired?: boolean;
}

export interface VesselClassSpec {
  id: VesselClassType;
  name: string;
  minDWT: number;
  maxDWT: number;
  typicalDWT: number;
  avgLOA: number;
  avgBeam: number;
  avgDraft: number;
  bunkerConsumptionSeaTPD: number; // VLSFO TPD
  bunkerConsumptionPortTPD: number;
  avgSpeedKnots: number;
  dailyCharterBaseRateUSD: number;
  co2FactorPerTonFuel: number;
}

export interface RouteSpec {
  id: string;
  originPortId: string;
  destinationPortId: string;
  distanceNauticalMiles: number;
  avgSailingDays: number;
  piracyRiskZone: boolean;
  monsoonAffected: boolean;
}

export interface FreightForecastPoint {
  date: string;
  timestamp: number;
  actualRateUSD?: number;
  predictedRateUSD: number;
  confidenceLowerUSD: number;
  confidenceUpperUSD: number;
  confidence95LowerUSD?: number;
  confidence95UpperUSD?: number;
  isForecast: boolean;
  eventAnnotation?: string;
}

export interface MarketRegimeInfo {
  regime: MarketRegimeType;
  confidencePct: number;
  explanation: string;
  historicalTrendDays: number;
  bdiIndex: number;
  bdiChange7D: number;
  volatilityIndexPct: number;
}

export interface RiskEvaluation {
  overallScore: number; // 0-100 (higher = riskier)
  freightRisk: RiskLevelType;
  freightRiskScore: number;
  freightRiskReason: string;
  portCongestionRisk: RiskLevelType;
  portCongestionScore: number;
  portCongestionReason: string;
  vesselCompatibilityRisk: RiskLevelType;
  vesselCompatibilityScore: number;
  vesselCompatibilityReason: string;
  delayRisk: RiskLevelType;
  delayRiskScore: number;
  delayRiskReason: string;
  contractExposureRisk: RiskLevelType;
  contractExposureScore: number;
  contractExposureReason: string;
}

export interface VesselCandidateAnalysis {
  vesselClass: VesselClassType;
  dwtCapacity: number;
  requiredVoyages: number;
  draft: number;
  loa: number;
  beam: number;
  originFit: CompatibilityStatus;
  originFitReason: string;
  destFit: CompatibilityStatus;
  destFitReason: string;
  estimatedFreightPerMT: number;
  voyageDurationDays: number;
  turnaroundDays: number;
  idleRisk: RiskLevelType;
  totalCostUSD: number;
  totalCostINRCrores: number;
  overallScore: number; // 0-100
  isRecommended: boolean;
  bunkerCostUSD: number;
  portDuesUSD: number;
  demurrageRiskCostUSD: number;
}

export interface ContractComparisonOption {
  strategy: ContractStrategyType;
  title: string;
  expectedTotalCostINRCrores: number;
  expectedRateUSDPerMT: number;
  marketExposureLevel: RiskLevelType;
  operationalFlexibility: 'High' | 'Medium' | 'Low';
  availabilityRisk: RiskLevelType;
  idleRisk: RiskLevelType;
  expectedSavingsPct: number;
  riskScore: number;
  isRecommended: boolean;
  pros: string[];
  cons: string[];
}

export interface CharterPlannerInput {
  commodity: string;
  cargoQuantityMT: number;
  originCountry: string;
  originPortId: string;
  destPortId: string;
  laycanStart: string;
  deliveryDeadline: string;
  contractHorizonMonths: number;
  expectedVoyagesCount: number;
  preferredVesselClass?: VesselClassType | 'ANY';
  maxAcceptableFreightUSD?: number;
  riskTolerance: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  fuelPriceAssumptionUSD: number; // e.g. 620 $/MT VLSFO
  urgency: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export interface CharterRecommendationResult {
  cargoInput: CharterPlannerInput;
  timestamp: string;
  recommendedVessel: VesselClassType;
  recommendedRoute: string;
  recommendedEntryWindow: string; // e.g. "Next 4–7 days (Aug 27 - Aug 30)"
  recommendedContract: ContractStrategyType;
  expectedFreightRateUSD: number;
  expectedTotalCostUSD: number;
  expectedTotalCostINRCrores: number;
  expectedSavingsPct: number;
  baselineSpotCostINRCrores: number;
  overallRisk: number;
  regime: MarketRegimeInfo;
  riskEvaluation: RiskEvaluation;
  vesselCandidates: VesselCandidateAnalysis[];
  contractComparisons: ContractComparisonOption[];
  decisionPillars: {
    title: string;
    description: string;
    iconType: string;
  }[];
  mathematicalEquation: {
    formula: string;
    breakdown: { label: string; valueUSD: number; valueINR: number; sharePct: number }[];
  };
}

export interface WhatIfSimulationParams {
  freightRateShiftPct: number; // -30% to +30%
  bunkerFuelShiftPct: number; // -20% to +50%
  portDelayDays: number; // 0 to 15 days
  cargoQuantityShiftPct: number; // -50% to +50%
  congestionSeverity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface IdleEmploymentScenario {
  vesselClass: VesselClassType;
  currentDischargePort: string;
  expectedIdleDaysCurrentPort: number;
  dailyIdleCostUSD: number;
  alternativeDestinationPort: string;
  ballastDistanceNM: number;
  repositioningCostUSD: number;
  daysSaved: number;
  nextCargoDemandProbabilityPct: number;
  recommendationText: string;
  netFinancialBenefitUSD: number;
}
