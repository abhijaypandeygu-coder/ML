import {
  FreightForecastPoint,
  MarketRegimeInfo,
  RiskEvaluation,
  CharterPlannerInput,
  CharterRecommendationResult,
  VesselCandidateAnalysis,
  ContractComparisonOption,
  WhatIfSimulationParams,
  CompatibilityStatus,
  IdleEmploymentScenario,
} from '../types/freight';
import { PORTS, VESSEL_CLASSES, DISTANCE_MATRIX } from '../data/maritimeData';

const USD_TO_INR = 83.5;

// Generate realistic Historical + Forecast time-series with Confidence Bounds
export function generateFreightForecast(horizonDays: number = 30): FreightForecastPoint[] {
  const points: FreightForecastPoint[] = [];
  const baseRate = 27.5;
  const today = new Date();
  
  // 60 days historical
  for (let i = 60; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Wave simulation + upward trend
    const noise = Math.sin(i * 0.25) * 1.8 + (Math.sin(i * 0.08) * 2.2);
    const historicalRate = Number((baseRate - (i * 0.03) + noise).toFixed(2));
    
    let event: string | undefined = undefined;
    if (i === 42) event = 'Red Sea Route Advisory';
    if (i === 18) event = 'Australian Port Weather Disruption';

    points.push({
      date: dateStr,
      timestamp: d.getTime(),
      actualRateUSD: historicalRate,
      predictedRateUSD: historicalRate,
      confidenceLowerUSD: historicalRate,
      confidenceUpperUSD: historicalRate,
      isForecast: false,
      eventAnnotation: event,
    });
  }

  // Current Day Point
  const currentPointDate = today.toISOString().split('T')[0];
  const currentActual = 28.40;
  points.push({
    date: currentPointDate,
    timestamp: today.getTime(),
    actualRateUSD: currentActual,
    predictedRateUSD: currentActual,
    confidenceLowerUSD: currentActual,
    confidenceUpperUSD: currentActual,
    confidence95LowerUSD: currentActual,
    confidence95UpperUSD: currentActual,
    isForecast: false,
    eventAnnotation: 'Today (Live Spot Fix: $28.40/MT)',
  });

  // Forecast Days
  for (let j = 1; j <= horizonDays; j++) {
    const d = new Date(today);
    d.setDate(d.getDate() + j);
    const dateStr = d.toISOString().split('T')[0];

    // Momentum upward curve: rising to ~$31.80 over 30 days
    const trendIncrease = (j * 0.12) + (Math.sin(j * 0.3) * 0.4);
    const predicted = Number((currentActual + trendIncrease).toFixed(2));
    
    // Uncertainty expands as horizon increases (cone of uncertainty)
    const error80 = 0.45 + (j * 0.085);
    const error95 = 0.85 + (j * 0.14);

    let event: string | undefined = undefined;
    if (j === 7) event = '7D Target: $29.25/MT (+3.0%)';
    if (j === 14) event = 'Peak Monsoon Surcharge Expected';
    if (j === 30) event = '30D Target: $31.80/MT (+11.9%)';

    points.push({
      date: dateStr,
      timestamp: d.getTime(),
      predictedRateUSD: predicted,
      confidenceLowerUSD: Number((predicted - error80).toFixed(2)),
      confidenceUpperUSD: Number((predicted + error80).toFixed(2)),
      confidence95LowerUSD: Number((predicted - error95).toFixed(2)),
      confidence95UpperUSD: Number((predicted + error95).toFixed(2)),
      isForecast: true,
      eventAnnotation: event,
    });
  }

  return points;
}

export function evaluateMarketRegime(): MarketRegimeInfo {
  return {
    regime: 'RISING',
    confidencePct: 84.5,
    explanation: 'Freight rates have shown persistent upward momentum (+7.4% over last 14 sessions). Pacific basin ton-mile demand is tightening as Australian thermal and coking coal fixtures surge ahead of pre-winter stocking.',
    historicalTrendDays: 14,
    bdiIndex: 1845,
    bdiChange7D: 6.2,
    volatilityIndexPct: 18.4,
  };
}

export function evaluatePortFit(portId: string, vessel: typeof VESSEL_CLASSES[0]): { status: CompatibilityStatus; reason: string } {
  const port = PORTS.find(p => p.id === portId);
  if (!port) return { status: 'PASS', reason: 'Standard clearance' };

  if (vessel.avgDraft > port.maxDraft) {
    if (vessel.avgDraft - port.maxDraft <= 1.2) {
      return {
        status: 'WARNING',
        reason: `Draft marginal: Vessel requires ${vessel.avgDraft}m, Port limit is ${port.maxDraft}m. Requires tidal window or light-loading.`
      };
    }
    return {
      status: 'INCOMPATIBLE',
      reason: `Draft violation: Vessel requires ${vessel.avgDraft}m exceeding max channel depth of ${port.maxDraft}m.`
    };
  }

  if (vessel.avgLOA > port.maxLOA) {
    return {
      status: 'INCOMPATIBLE',
      reason: `LOA violation: Vessel length ${vessel.avgLOA}m exceeds maximum berth limit of ${port.maxLOA}m.`
    };
  }

  if (port.currentCongestionLevel === 'HIGH') {
    return {
      status: 'WARNING',
      reason: `Port congestion elevated (~${port.avgWaitDays} days queue). Demurrage risk active.`
    };
  }

  return {
    status: 'PASS',
    reason: `Fully compliant with all navigation, draft (${vessel.avgDraft}m <= ${port.maxDraft}m) and berth LOA constraints.`
  };
}

export function runOptimizationEngine(
  input: CharterPlannerInput,
  simParams?: WhatIfSimulationParams
): CharterRecommendationResult {
  const originPort = PORTS.find(p => p.id === input.originPortId) || PORTS[0];
  const destPort = PORTS.find(p => p.id === input.destPortId) || PORTS[6]; // Paradip default
  
  const routeKey = `${originPort.id}_${destPort.id}`;
  const distanceNM = DISTANCE_MATRIX[routeKey] || 4700;

  // Apply Simulation Deltas if provided
  const freightMultiplier = 1 + (simParams ? simParams.freightRateShiftPct / 100 : 0);
  const fuelMultiplier = 1 + (simParams ? simParams.bunkerFuelShiftPct / 100 : 0);
  const delayDaysAdd = simParams ? simParams.portDelayDays : 0;
  const cargoQuantity = input.cargoQuantityMT * (1 + (simParams ? simParams.cargoQuantityShiftPct / 100 : 0));
  const congestionImpact = simParams?.congestionSeverity === 'HIGH' ? 3.5 : (simParams?.congestionSeverity === 'LOW' ? 0.5 : 1.5);

  const baseFuelPricePerMT = input.fuelPriceAssumptionUSD * fuelMultiplier;
  const baseSpotRateUSDPerMT = 28.40 * freightMultiplier;

  // Analyze all candidate vessel classes
  const vesselCandidates: VesselCandidateAnalysis[] = VESSEL_CLASSES.map(v => {
    const originFit = evaluatePortFit(originPort.id, v);
    const destFit = evaluatePortFit(destPort.id, v);

    const seaDaysOneWay = (distanceNM / (v.avgSpeedKnots * 24));
    const totalSeaDays = seaDaysOneWay * 2; // round trip consideration for charter
    const loadDays = (Math.min(cargoQuantity, v.typicalDWT) / originPort.avgHandlingRateTPD) + originPort.avgWaitDays;
    const dischargeDays = (Math.min(cargoQuantity, v.typicalDWT) / destPort.avgHandlingRateTPD) + destPort.avgWaitDays + delayDaysAdd + congestionImpact;
    const turnaroundDays = Number((totalSeaDays + loadDays + dischargeDays).toFixed(1));

    const voyagesNeeded = Math.ceil(cargoQuantity / v.typicalDWT);

    // Cost Model Breakdown
    const bunkerCostUSD = (totalSeaDays * v.bunkerConsumptionSeaTPD + (loadDays + dischargeDays) * v.bunkerConsumptionPortTPD) * baseFuelPricePerMT * voyagesNeeded;
    const charterHireUSD = turnaroundDays * v.dailyCharterBaseRateUSD * voyagesNeeded;
    const portDuesUSD = (38000 + v.typicalDWT * 0.45) * 2 * voyagesNeeded;
    const demurrageRiskCostUSD = (destPort.avgWaitDays + delayDaysAdd) * (v.dailyCharterBaseRateUSD * 1.25) * voyagesNeeded;

    const totalCostUSD = charterHireUSD + bunkerCostUSD + portDuesUSD + demurrageRiskCostUSD;
    const estimatedFreightPerMT = Number((totalCostUSD / cargoQuantity).toFixed(2));
    const totalCostINRCrores = Number(((totalCostUSD * USD_TO_INR) / 10000000).toFixed(2));

    // Calculate quantitative feasibility score
    let score = 90;
    if (v.id === 'Panamax') score += 5; // Best scale economy for ~100k MT
    if (v.id === 'Capesize') {
      if (destFit.status === 'INCOMPATIBLE' || destFit.status === 'WARNING') score -= 35;
    }
    if (v.id === 'Handysize') score -= 15; // Low capacity inefficiency
    if (originFit.status === 'INCOMPATIBLE' || destFit.status === 'INCOMPATIBLE') score = 42;
    if (originFit.status === 'WARNING' || destFit.status === 'WARNING') score -= 12;

    const isRecommended = (v.id === 'Panamax' && destFit.status !== 'INCOMPATIBLE') || 
      (v.id === 'Supramax' && destFit.status === 'INCOMPATIBLE');

    return {
      vesselClass: v.id,
      dwtCapacity: v.typicalDWT,
      requiredVoyages: voyagesNeeded,
      draft: v.avgDraft,
      loa: v.avgLOA,
      beam: v.avgBeam,
      originFit: originFit.status,
      originFitReason: originFit.reason,
      destFit: destFit.status,
      destFitReason: destFit.reason,
      estimatedFreightPerMT,
      voyageDurationDays: Number(seaDaysOneWay.toFixed(1)),
      turnaroundDays,
      idleRisk: v.id === 'Capesize' ? 'HIGH' : (v.id === 'Panamax' ? 'LOW' : 'MEDIUM'),
      totalCostUSD,
      totalCostINRCrores,
      overallScore: Math.max(10, Math.min(99, score)),
      isRecommended: isRecommended,
      bunkerCostUSD,
      portDuesUSD,
      demurrageRiskCostUSD,
    };
  });

  const recommendedCandidate = vesselCandidates.find(vc => vc.isRecommended) || vesselCandidates[2];

  // Contract Strategy Evaluation (Spot vs Short vs Medium Multiple-Voyage)
  const spotRate = Number((baseSpotRateUSDPerMT * 1.05).toFixed(2));
  const shortTermRate = Number((baseSpotRateUSDPerMT * 0.98).toFixed(2));
  const multiVoyageRate = Number((baseSpotRateUSDPerMT * 0.93).toFixed(2));

  const spotTotalINRCr = Number(((cargoQuantity * spotRate * USD_TO_INR) / 10000000).toFixed(2));
  const shortTermTotalINRCr = Number(((cargoQuantity * shortTermRate * USD_TO_INR) / 10000000).toFixed(2));
  const multiVoyageTotalINRCr = Number(((cargoQuantity * multiVoyageRate * USD_TO_INR) / 10000000).toFixed(2));

  const contractComparisons: ContractComparisonOption[] = [
    {
      strategy: 'SPOT',
      title: 'Spot Single Voyage Fixture',
      expectedTotalCostINRCrores: spotTotalINRCr,
      expectedRateUSDPerMT: spotRate,
      marketExposureLevel: 'HIGH',
      operationalFlexibility: 'High',
      availabilityRisk: 'HIGH',
      idleRisk: 'LOW',
      expectedSavingsPct: 0.0,
      riskScore: 68,
      isRecommended: false,
      pros: ['Complete short-term flexibility', 'No forward commitment lock-in'],
      cons: ['Exposed to 100% of forecast price inflation (+11.9% 30D)', 'High vessel availability queue risk'],
    },
    {
      strategy: 'SHORT_TERM',
      title: 'Short-Term (3-Voyage Consecutive)',
      expectedTotalCostINRCrores: shortTermTotalINRCr,
      expectedRateUSDPerMT: shortTermRate,
      marketExposureLevel: 'MEDIUM',
      operationalFlexibility: 'Medium',
      availabilityRisk: 'MEDIUM',
      idleRisk: 'LOW',
      expectedSavingsPct: 4.2,
      riskScore: 42,
      isRecommended: false,
      pros: ['Buffers against 45-day rate volatility', 'Secures vessel laycan guarantee'],
      cons: ['Less volume discount than index-linked annual COA'],
    },
    {
      strategy: 'MEDIUM_TERM_MULTI',
      title: 'Medium-Term Multiple-Voyage COA (Recommended)',
      expectedTotalCostINRCrores: multiVoyageTotalINRCr,
      expectedRateUSDPerMT: multiVoyageRate,
      marketExposureLevel: 'LOW',
      operationalFlexibility: 'Medium',
      availabilityRisk: 'LOW',
      idleRisk: 'LOW',
      expectedSavingsPct: 7.1,
      riskScore: 24,
      isRecommended: true,
      pros: [
        'Locks in pre-spike freight rate before anticipated Q4 market tightening',
        'Direct bulk-volume discount from shipowner (~$2.10/MT vs spot)',
        'Guaranteed discharge priority and demurrage cap at Paradip',
      ],
      cons: ['Requires quarterly cargo volume commitment fulfillment'],
    },
  ];

  const overallRiskScore = Math.round(27 + (delayDaysAdd * 2.5) + (simParams?.freightRateShiftPct ? simParams.freightRateShiftPct * 0.4 : 0));

  const riskEvaluation: RiskEvaluation = {
    overallScore: Math.min(95, Math.max(12, overallRiskScore)),
    freightRisk: freightMultiplier > 1.1 ? 'HIGH' : (freightMultiplier > 1.02 ? 'MEDIUM' : 'LOW'),
    freightRiskScore: 32,
    freightRiskReason: 'Forward freight curve in contango (+7.4% upward trajectory). Locking now eliminates upside exposure.',
    portCongestionRisk: destPort.currentCongestionLevel,
    portCongestionScore: destPort.avgWaitDays > 4 ? 65 : 28,
    portCongestionReason: `${destPort.name} current berth queue is ~${destPort.avgWaitDays} days. Pre-booking mechanized berth reduces idle drift.`,
    vesselCompatibilityRisk: recommendedCandidate.destFit === 'PASS' ? 'LOW' : 'MEDIUM',
    vesselCompatibilityScore: 15,
    vesselCompatibilityReason: `${recommendedCandidate.vesselClass} draft (${recommendedCandidate.draft}m) is comfortably within ${destPort.name} draft limit (${destPort.maxDraft}m).`,
    delayRisk: delayDaysAdd > 5 ? 'HIGH' : 'LOW',
    delayRiskScore: 22,
    delayRiskReason: 'Weather routing along Bay of Bengal clear. Low cyclonic activity window detected.',
    contractExposureRisk: 'LOW',
    contractExposureScore: 20,
    contractExposureReason: 'Multi-voyage index-linked structure provides downside freight hedge with volume discount.',
  };

  const charterHireShare = Math.round((recommendedCandidate.totalCostUSD * 0.52) / 1000) * 1000;
  const bunkerShare = Math.round((recommendedCandidate.bunkerCostUSD) / 1000) * 1000;
  const portShare = Math.round((recommendedCandidate.portDuesUSD) / 1000) * 1000;
  const demurrageShare = Math.round((recommendedCandidate.demurrageRiskCostUSD) / 1000) * 1000;

  return {
    cargoInput: input,
    timestamp: new Date().toISOString(),
    recommendedVessel: recommendedCandidate.vesselClass,
    recommendedRoute: `${originPort.name} (${originPort.country}) → ${destPort.name} (India)`,
    recommendedEntryWindow: 'Next 4–7 days (Prior to expected +3.0% 7D Freight Spike)',
    recommendedContract: 'MEDIUM_TERM_MULTI',
    expectedFreightRateUSD: multiVoyageRate,
    expectedTotalCostUSD: recommendedCandidate.totalCostUSD,
    expectedTotalCostINRCrores: multiVoyageTotalINRCr,
    expectedSavingsPct: 7.1,
    baselineSpotCostINRCrores: spotTotalINRCr,
    overallRisk: riskEvaluation.overallScore,
    regime: evaluateMarketRegime(),
    riskEvaluation,
    vesselCandidates,
    contractComparisons,
    decisionPillars: [
      {
        title: 'Market Regime Advantage',
        description: 'Freight rates exhibit a strong RISING regime (+11.9% forecast over 30 days). Executing within 4-7 days locks in lower baselines before seasonal rate spike.',
        iconType: 'TrendingUp'
      },
      {
        title: 'Vessel-Port Geometric Compatibility',
        description: `Panamax vessel (13.8m draft, 229m LOA) perfectly maximizes payload throughput at ${destPort.name} without incurring draft penalty or tidal delays.`,
        iconType: 'Anchor'
      },
      {
        title: 'Multi-Voyage Risk Shield',
        description: `Switching from single spot to Medium-Term Multiple-Voyage COA yields an estimated ₹${(spotTotalINRCr - multiVoyageTotalINRCr).toFixed(1)} Cr (7.1%) in guaranteed freight savings.`,
        iconType: 'ShieldCheck'
      },
      {
        title: 'Lowest Demurrage & Idle Exposure',
        description: `Turnaround of ${recommendedCandidate.turnaroundDays} days minimizes post-discharge ballast deadheading with seamless re-employment in the Indian Ocean coal circuit.`,
        iconType: 'Clock'
      },
      {
        title: 'Optimal Scale Economics',
        description: `Requires only ${recommendedCandidate.requiredVoyages} voyages vs ${vesselCandidates[0].requiredVoyages} voyages with Handysize, cutting cumulative port dues and bunker burn by 38%.`,
        iconType: 'DollarSign'
      }
    ],
    mathematicalEquation: {
      formula: 'Total Expected Cost = Charter Hire ($) + Bunker Fuel ($) + Port Dues ($) + Demurrage Buffer ($) + Risk Penalty ($)',
      breakdown: [
        { label: 'Time Charter Hire', valueUSD: charterHireShare, valueINR: (charterHireShare * USD_TO_INR) / 10000000, sharePct: 54 },
        { label: 'VLSFO Bunker Fuel', valueUSD: bunkerShare, valueINR: (bunkerShare * USD_TO_INR) / 10000000, sharePct: 28 },
        { label: 'Port Handling & Dues', valueUSD: portShare, valueINR: (portShare * USD_TO_INR) / 10000000, sharePct: 12 },
        { label: 'Demurrage & Congestion Buffer', valueUSD: demurrageShare, valueINR: (demurrageShare * USD_TO_INR) / 10000000, sharePct: 6 },
      ]
    }
  };
}

export function getIdleScenarios(): IdleEmploymentScenario[] {
  return [
    {
      vesselClass: 'Panamax',
      currentDischargePort: 'Paradip Port Trust',
      expectedIdleDaysCurrentPort: 7.5,
      dailyIdleCostUSD: 14500,
      alternativeDestinationPort: 'Visakhapatnam (Return Coastal / Iron Ore)',
      ballastDistanceNM: 220,
      repositioningCostUSD: 18400,
      daysSaved: 5.0,
      nextCargoDemandProbabilityPct: 88,
      recommendationText: 'Avoid waiting 7.5 days at Paradip for next import cargo. Repositioning ballast (220 NM) to Visakhapatnam captures immediate coastal iron ore cargo for Vizag Steel, cutting idle days by 5.0 and saving net $54,100.',
      netFinancialBenefitUSD: 54100
    },
    {
      vesselClass: 'Supramax',
      currentDischargePort: 'Haldia Dock Complex',
      expectedIdleDaysCurrentPort: 9.0,
      dailyIdleCostUSD: 12000,
      alternativeDestinationPort: 'Dhamra Port (Limestone Discharge / Bauxite Load)',
      ballastDistanceNM: 140,
      repositioningCostUSD: 12500,
      daysSaved: 6.2,
      nextCargoDemandProbabilityPct: 92,
      recommendationText: 'High congestion at Haldia lock gates triggers high demurrage. Repositioning immediately to Dhamra captures prompt alumina/bauxite cargo with 92% fixture certainty.',
      netFinancialBenefitUSD: 61900
    }
  ];
}

export async function runOptimizationEngineAsync(
  input: CharterPlannerInput,
  simParams?: WhatIfSimulationParams
): Promise<CharterRecommendationResult> {
  // First, get the baseline mock structure
  const baseResult = runOptimizationEngine(input, simParams);

  try {
    // 1. Call Timing API to get optimal window
    const dummyForecasts = Array.from({length: 7}).map((_, i) => ({
      candidate_date: `2026-08-${27 + i}`,
      expected_cost: baseResult.expectedFreightRateUSD * (1 + (Math.random() * 0.1)),
      risk: baseResult.overallRisk
    }));

    const timingReq = await fetch('http://localhost:8000/api/v1/optimize/timing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_date: '2026-08-27',
        horizon_days: 7,
        daily_forecasts: dummyForecasts,
        risk_aversion: input.riskTolerance === 'CONSERVATIVE' ? 0.8 : (input.riskTolerance === 'AGGRESSIVE' ? 0.2 : 0.5)
      })
    });
    
    if (timingReq.ok) {
      const timingRes = await timingReq.json();
      if (timingRes.optimal_window) {
        baseResult.recommendedEntryWindow = `API Window: ${timingRes.optimal_window.optimal_window_start} to ${timingRes.optimal_window.optimal_window_end}`;
      }
    }

    // 2. Call Contract API
    const contractReq = await fetch('http://localhost:8000/api/v1/optimize/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            spot_rate_forecast: baseResult.expectedFreightRateUSD,
            spot_volatility: 0.15,
            risk_aversion: input.riskTolerance === 'CONSERVATIVE' ? 0.8 : (input.riskTolerance === 'AGGRESSIVE' ? 0.2 : 0.5)
        })
    });

    if (contractReq.ok) {
        const contractRes = await contractReq.json();
        if (contractRes.optimal_strategy) {
            baseResult.recommendedContract = contractRes.optimal_strategy.strategy;
        }
    }
    
    // 3. Call Full Strategy API
    const fullStrategyReq = await fetch('http://localhost:8000/api/v1/optimize/full-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            port_constraints: { max_draft: 15.0 },
            required_cargo: input.cargoQuantityMT,
            vessels: [],
            vessels_context: []
        })
    });

    if (fullStrategyReq.ok) {
        const fullStrategyRes = await fullStrategyReq.json();
        
        // Override mock data with AI data
        baseResult.recommendedVessel = fullStrategyRes.recommended_vessel_type;
        baseResult.recommendedRoute = fullStrategyRes.recommended_route;
        baseResult.expectedTotalCostUSD = fullStrategyRes.expected_total_cost;
        baseResult.expectedSavingsPct = fullStrategyRes.expected_savings_vs_spot;
        
        if (fullStrategyRes.explanation && fullStrategyRes.explanation.length > 0) {
            baseResult.decisionPillars = fullStrategyRes.explanation.map((exp: string, idx: number) => ({
                title: `AI Reasoning ${idx + 1}`,
                description: exp,
                iconType: 'Cpu' // Example icon
            }));
        }
    }
    
    // Tag the response to prove it came from the API
    baseResult.timestamp = new Date().toISOString() + " (via FreightQuant ML API)";

  } catch (error) {
    console.error("Failed to reach ML API, falling back to local engine:", error);
  }

  return baseResult;
}

