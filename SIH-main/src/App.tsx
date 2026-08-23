import React, { useState } from 'react';
import { Navbar, MainNavPage } from './components/website/Navbar';
import { HomePage } from './components/website/HomePage';
import { ServicesPage } from './components/website/ServicesPage';
import { MethodologyPage } from './components/website/MethodologyPage';
import { FeaturesPage } from './components/website/FeaturesPage';
import { AboutPage } from './components/website/AboutPage';
import { ContactPage } from './components/website/ContactPage';
import { Footer } from './components/website/Footer';

import { Sidebar, NavPage } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { KPICards } from './components/dashboard/KPICards';
import { ForecastChart } from './components/charts/ForecastChart';
import { RiskMonitorPanel } from './components/dashboard/RiskMonitorPanel';
import { CharterPlanner } from './components/planner/CharterPlanner';
import { VesselPortOptimizer } from './components/vessels/VesselPortOptimizer';
import { CharterStrategyView } from './components/strategy/CharterStrategyView';
import { WhatIfSimulator } from './components/simulator/WhatIfSimulator';
import { IdlePlannerView } from './components/idle/IdlePlannerView';
import { MarketRiskMonitorView } from './components/market/MarketRiskMonitorView';
import { ModelTransparencyView } from './components/transparency/ModelTransparencyView';
import { SettingsDataSourcesView } from './components/settings/SettingsDataSourcesView';
import { ExplanationModal } from './components/modals/ExplanationModal';
import { DemoGuideModal } from './components/modals/DemoGuideModal';

import { 
  CharterPlannerInput, 
  CharterRecommendationResult, 
  FreightForecastPoint 
} from './types/freight';
import { 
  generateFreightForecast, 
  runOptimizationEngine,
  runOptimizationEngineAsync
} from './services/charterEngine';
import { PORTS } from './data/maritimeData';
import { ArrowLeft } from 'lucide-react';

export function App() {
  // Navigation State: 'home' | 'services' | 'methodology' | 'features' | 'dashboard' | 'about' | 'contact'
  const [mainNav, setMainNav] = useState<MainNavPage>('home');
  
  // Terminal Internal Navigation State
  const [activeDashboardTab, setActiveDashboardTab] = useState<NavPage>('dashboard');
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Baseline SIH 26006 Scenario State
  const [plannerInput, setPlannerInput] = useState<CharterPlannerInput>({
    commodity: 'Premium Coking Coal',
    cargoQuantityMT: 100000,
    originCountry: 'Australia',
    originPortId: 'port-hay-point',
    destPortId: 'port-paradip',
    laycanStart: '2026-08-27',
    deliveryDeadline: '2026-09-26',
    contractHorizonMonths: 3,
    expectedVoyagesCount: 2,
    preferredVesselClass: 'Panamax',
    maxAcceptableFreightUSD: 32.0,
    riskTolerance: 'BALANCED',
    fuelPriceAssumptionUSD: 620,
    urgency: 'NORMAL',
  });

  // Freight Forward Curve Data
  const forecastData = React.useMemo<FreightForecastPoint[]>(() => {
    return generateFreightForecast(30);
  }, []);

  // Optimized Recommendation State
  const [recommendation, setRecommendation] = useState<CharterRecommendationResult>(() => {
    return runOptimizationEngine(plannerInput);
  });

  const handleAnalyze = async (input: CharterPlannerInput) => {
    setIsCalculating(true);
    setPlannerInput(input);

    const result = await runOptimizationEngineAsync(input);
    setRecommendation(result);
    setIsCalculating(false);
    setActiveDashboardTab('strategy');
  };

  const handleRunSIHDemo = () => {
    const demoInput: CharterPlannerInput = {
      commodity: 'Premium Coking Coal',
      cargoQuantityMT: 100000,
      originCountry: 'Australia',
      originPortId: 'port-hay-point',
      destPortId: 'port-paradip',
      laycanStart: '2026-08-27',
      deliveryDeadline: '2026-09-26',
      contractHorizonMonths: 3,
      expectedVoyagesCount: 2,
      preferredVesselClass: 'Panamax',
      maxAcceptableFreightUSD: 32.0,
      riskTolerance: 'BALANCED',
      fuelPriceAssumptionUSD: 620,
      urgency: 'NORMAL',
    };
    handleAnalyze(demoInput);
  };

  const selectedOrigin = PORTS.find(p => p.id === plannerInput.originPortId)?.name || 'Hay Point';
  const selectedDest = PORTS.find(p => p.id === plannerInput.destPortId)?.name || 'Paradip Port';
  const routeName = `${selectedOrigin} (Aus) → ${selectedDest} (India)`;

  // Scroll to top whenever main navigation changes
  const handlePageNavigation = (page: MainNavPage) => {
    setMainNav(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. Global Navigation Bar */}
      <Navbar activePage={mainNav} onNavigate={handlePageNavigation} />

      {/* 2. Main Body Content Based on Active Page */}
      {mainNav === 'home' && (
        <main className="flex-1">
          <HomePage onNavigate={handlePageNavigation} />
        </main>
      )}

      {mainNav === 'services' && (
        <main className="flex-1">
          <ServicesPage onNavigate={handlePageNavigation} />
        </main>
      )}

      {mainNav === 'methodology' && (
        <main className="flex-1">
          <MethodologyPage onNavigate={handlePageNavigation} />
        </main>
      )}

      {mainNav === 'features' && (
        <main className="flex-1">
          <FeaturesPage onNavigate={handlePageNavigation} />
        </main>
      )}

      {mainNav === 'about' && (
        <main className="flex-1">
          <AboutPage onNavigate={handlePageNavigation} />
        </main>
      )}

      {mainNav === 'contact' && (
        <main className="flex-1">
          <ContactPage />
        </main>
      )}

      {/* 3. Platform Dashboard (Full Interactive Trading Terminal View) */}
      {mainNav === 'dashboard' && (
        <div className="pt-20 flex-1 flex min-h-[calc(100vh-80px)] bg-[#070d1e] text-slate-100">
          {/* Terminal Sidebar */}
          <Sidebar
            activePage={activeDashboardTab}
            onNavigate={(p) => setActiveDashboardTab(p)}
            isAnalyzed={true}
          />

          {/* Terminal Main Workspace */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <Header
              selectedRouteName={routeName}
              onOpenExplainModal={() => setIsExplainModalOpen(true)}
              onOpenDemoFlow={() => setIsDemoGuideOpen(true)}
            />

            <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
              {/* Return to website banner */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1e3362]">
                <button
                  onClick={() => handlePageNavigation('home')}
                  className="text-xs font-semibold text-slate-400 hover:text-blue-400 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to FreightQuant Overview</span>
                </button>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  Active Corridor: Australia → Paradip Port
                </span>
              </div>

              {/* Sub-view switcher inside Dashboard */}
              {activeDashboardTab === 'dashboard' && (
                <div className="space-y-6">
                  <KPICards
                    currentRate={28.40}
                    forecast7D={29.25}
                    forecast30D={31.80}
                    regime={recommendation.regime}
                    risk={recommendation.riskEvaluation}
                    savingsPct={recommendation.expectedSavingsPct}
                    onOpenPlanner={() => setActiveDashboardTab('planner')}
                  />
                  <ForecastChart data={forecastData} />
                  <RiskMonitorPanel risk={recommendation.riskEvaluation} />
                </div>
              )}

              {activeDashboardTab === 'planner' && (
                <CharterPlanner
                  initialValues={plannerInput}
                  onAnalyze={handleAnalyze}
                  isCalculating={isCalculating}
                />
              )}

              {activeDashboardTab === 'forecast' && (
                <div className="space-y-6">
                  <ForecastChart data={forecastData} />
                  <RiskMonitorPanel risk={recommendation.riskEvaluation} />
                </div>
              )}

              {activeDashboardTab === 'vessels' && (
                <VesselPortOptimizer
                  candidates={recommendation.vesselCandidates}
                  destPortId={plannerInput.destPortId}
                />
              )}

              {activeDashboardTab === 'strategy' && (
                <CharterStrategyView
                  recommendation={recommendation}
                  onOpenExplainModal={() => setIsExplainModalOpen(true)}
                  onOpenSimulator={() => setActiveDashboardTab('simulator')}
                />
              )}

              {activeDashboardTab === 'simulator' && (
                <WhatIfSimulator
                  baseInput={plannerInput}
                  baseRecommendation={recommendation}
                />
              )}

              {activeDashboardTab === 'market' && (
                <MarketRiskMonitorView />
              )}

              {activeDashboardTab === 'performance' && (
                <ModelTransparencyView />
              )}

              {activeDashboardTab === 'settings' && (
                <SettingsDataSourcesView />
              )}
            </main>
          </div>
        </div>
      )}

      {/* 4. Global Footer (Visible across all marketing/product pages) */}
      {mainNav !== 'dashboard' && (
        <Footer onNavigate={handlePageNavigation} />
      )}

      {/* 5. Modals */}
      <ExplanationModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        recommendation={recommendation}
      />

      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onNavigate={(p) => setActiveDashboardTab(p)}
        onRunSIHDemo={handleRunSIHDemo}
      />
    </div>
  );
}

export default App;
