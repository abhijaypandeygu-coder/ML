import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  BarChart2, 
  HelpCircle, 
  Layers, 
  Sparkles,
  GitBranch
} from 'lucide-react';

export const ModelTransparencyView: React.FC = () => {
  const modelComparisons = [
    {
      name: 'DeepAR Probabilistic Recurrent Network',
      type: 'Deep Learning',
      mae: '0.42 $/MT',
      rmse: '0.58 $/MT',
      mape: '1.48%',
      dirAcc: '84.2%',
      status: 'ACTIVE MODEL',
      selected: true,
      description: 'Generates probabilistic forecast trajectories and robust uncertainty cones (80% and 95% intervals) calibrated on multi-year Baltic Capesize and Panamax fixtures.',
    },
    {
      name: 'XGBoost Gradient Boosted Trees',
      type: 'Machine Learning',
      mae: '0.49 $/MT',
      rmse: '0.66 $/MT',
      mape: '1.72%',
      dirAcc: '81.0%',
      status: 'ENSEMBLE COMPONENT',
      selected: false,
      description: 'Captures non-linear relationships across bunker fuel prices, commodity port congestion, and seasonal Indian monsoon factors.',
    },
    {
      name: 'ARIMA / SARIMAX Baseline',
      type: 'Statistical Baseline',
      mae: '0.94 $/MT',
      rmse: '1.24 $/MT',
      mape: '3.35%',
      dirAcc: '66.4%',
      status: 'BENCHMARK BASELINE',
      selected: false,
      description: 'Traditional autoregressive moving average baseline used for comparative validation and sanity verification.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="terminal-card p-4 flex items-center justify-between border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-blue-600/20 text-cyan-400 border border-blue-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Forecasting Model Transparency & Quantitative Backtest Performance
            </h2>
            <p className="text-xs text-slate-400">
              Rigorous model evaluation metrics, backtesting performance on historical Baltic freight data, and error bounds.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
          Ensemble Active: DeepAR + XGBoost
        </span>
      </div>

      {/* Model Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modelComparisons.map((m, idx) => (
          <div
            key={idx}
            className={`terminal-card p-5 space-y-3.5 ${
              m.selected ? 'border-cyan-400 bg-[#0e224d]' : 'bg-[#0c1630]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#1e3362] pb-2.5">
              <span className="font-bold text-xs text-slate-100">{m.name}</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                m.selected ? 'bg-cyan-950 text-cyan-300 border border-cyan-600' : 'bg-[#111f42] text-slate-400'
              }`}>
                {m.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#070d1e] p-2 rounded border border-[#1e3362]">
                <span className="text-slate-400 text-[10px] block font-sans">MAE:</span>
                <span className="font-bold text-slate-200">{m.mae}</span>
              </div>
              <div className="bg-[#070d1e] p-2 rounded border border-[#1e3362]">
                <span className="text-slate-400 text-[10px] block font-sans">RMSE:</span>
                <span className="font-bold text-slate-200">{m.rmse}</span>
              </div>
              <div className="bg-[#070d1e] p-2 rounded border border-[#1e3362]">
                <span className="text-slate-400 text-[10px] block font-sans">MAPE:</span>
                <span className="font-bold text-emerald-400">{m.mape}</span>
              </div>
              <div className="bg-[#070d1e] p-2 rounded border border-[#1e3362]">
                <span className="text-slate-400 text-[10px] block font-sans">Directional Acc:</span>
                <span className="font-bold text-cyan-300">{m.dirAcc}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {m.description}
            </p>
          </div>
        ))}
      </div>

      {/* Feature Importance & Model Weights */}
      <div className="terminal-card p-5 space-y-4">
        <div className="border-b border-[#1e3362] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            Predictive Feature Attribution Weights
          </h3>
          <p className="text-xs text-slate-400">
            Shapley feature importance values driving the 30-day forward curve prediction.
          </p>
        </div>

        <div className="space-y-2.5 text-xs">
          {[
            { feature: 'BDI & Baltic Panamax Index 14-Day Velocity', weight: 34 },
            { feature: 'Singapore VLSFO Bunker Fuel Spread', weight: 22 },
            { feature: 'Australian Coal Terminal Queues & Laycan Congestion', weight: 18 },
            { feature: 'Indian Steel Production & Pre-Monsoon Coal Stocking Rate', weight: 15 },
            { feature: 'Weather Routing & Cyclone Seasonality Multiplier', weight: 11 },
          ].map((f, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>{f.feature}</span>
                <span className="font-mono font-bold text-cyan-300">{f.weight}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#070d1e] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  style={{ width: `${f.weight}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
