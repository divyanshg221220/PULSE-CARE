import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { FirstAidGuide } from '../../types/health';
import {
  LifeBuoy,
  Play,
  Pause,
  AlertCircle,
  Volume2,
  CheckCircle2,
  XCircle,
  Clock,
  Heart,
  Video,
  ChevronRight,
} from 'lucide-react';

export const FirstAidCenter: React.FC = () => {
  const { firstAidGuides, speakText } = useApp();

  const [selectedGuideId, setSelectedGuideId] = useState<string>(firstAidGuides[0].id);
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [beatCount, setBeatCount] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const activeGuide = firstAidGuides.find((g) => g.id === selectedGuideId) || firstAidGuides[0];

  // CPR Metronome implementation (110 BPM rhythm)
  useEffect(() => {
    let interval: any;
    if (isMetronomeActive) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const bpm = 110;
      const intervalMs = (60 / bpm) * 1000; // ~545ms per beat

      const playBeep = () => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // 880 Hz beep
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);

        setBeatCount((c) => (c % 30) + 1); // 30 compressions cycle
      };

      interval = setInterval(playBeep, intervalMs);
    } else {
      setBeatCount(0);
    }

    return () => clearInterval(interval);
  }, [isMetronomeActive]);

  const handleReadGuide = () => {
    const text = `First Aid Guide for ${activeGuide.title}. ${activeGuide.overview}. Step 1: ${activeGuide.steps[0].title}. ${activeGuide.steps[0].detail}`;
    speakText(text);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <LifeBuoy className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              First Aid Resource Center
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Rapid clinical triage guides, emergency CPR compression metronome, and step-by-step procedures.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Guide Directory vs Detailed Procedure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (4 Cols): Procedures Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Emergency Procedures</h2>
            <div className="space-y-2">
              {firstAidGuides.map((guide) => {
                const isSelected = guide.id === activeGuide.id;
                return (
                  <button
                    key={guide.id}
                    onClick={() => {
                      setSelectedGuideId(guide.id);
                      setIsMetronomeActive(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">
                        {guide.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="capitalize">{guide.category}</span>
                      <span>·</span>
                      <span>{guide.steps.length} Steps</span>
                      <span>·</span>
                      <span className="font-mono text-teal-700">{guide.videoDuration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): Selected Procedure View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Guide Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                  {activeGuide.urgency === 'immediate_call_911' ? 'Critical Emergency: Dispatch 911' : 'Standard First Aid'}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeGuide.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  {activeGuide.overview}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReadGuide}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-teal-600" />
                  <span>Read Guide</span>
                </button>
              </div>
            </div>

            {/* CPR Metronome Box (If active guide has CPR metronome) */}
            {activeGuide.hasCprMetronome && (
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">
                        AHA CPR Rhythm Counter (110 BPM)
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Audible acoustic metronome calibrated for optimal coronary perfusion pressure.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                      isMetronomeActive
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {isMetronomeActive ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Stop Metronome</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Start 110 BPM Audio</span>
                      </>
                    )}
                  </button>
                </div>

                {isMetronomeActive && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Current Compression in Cycle:</span>
                    <span className="text-2xl font-black text-rose-400">
                      {beatCount} / 30
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Step-by-Step Procedure Cards */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Action Steps
              </h3>
              <div className="space-y-3">
                {activeGuide.steps.map((st) => (
                  <div
                    key={st.stepNumber}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                        {st.stepNumber}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                      {st.detail}
                    </p>
                    {st.caution && (
                      <div className="ml-8 mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{st.caution}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Do Not Warnings */}
            {activeGuide.doNots?.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Critical Pitfalls & What NOT To Do</span>
                </span>
                <ul className="space-y-1 text-xs text-rose-800">
                  {activeGuide.doNots.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
