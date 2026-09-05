"use client";

import { useState } from "react";

type ServiceKey = "removal" | "trimming" | "stump" | "hedge";

const services: Record<
  ServiceKey,
  {
    label: string;
    sizeLabel: string;
    sizes: { label: string; low: number; high: number }[];
  }
> = {
  removal: {
    label: "Tree Removal",
    sizeLabel: "How tall is the tree?",
    sizes: [
      { label: "Under 30 ft", low: 400, high: 800 },
      { label: "30–60 ft", low: 800, high: 1800 },
      { label: "Over 60 ft", low: 1800, high: 4500 }
    ]
  },
  trimming: {
    label: "Trimming & Pruning",
    sizeLabel: "How much work?",
    sizes: [
      { label: "One limb or small tree", low: 250, high: 450 },
      { label: "Full prune, one tree", low: 450, high: 900 },
      { label: "Big canopy or 2+ trees", low: 900, high: 1800 }
    ]
  },
  stump: {
    label: "Stump Grinding",
    sizeLabel: "Stump width at the ground?",
    sizes: [
      { label: "Under 15 in.", low: 150, high: 250 },
      { label: "15–30 in.", low: 250, high: 400 },
      { label: "Over 30 in. / several", low: 400, high: 700 }
    ]
  },
  hedge: {
    label: "Hedge Trimming",
    sizeLabel: "How long is the hedge?",
    sizes: [
      { label: "Up to 25 ft", low: 95, high: 180 },
      { label: "25–75 ft", low: 180, high: 320 },
      { label: "Whole property", low: 320, high: 600 }
    ]
  }
};

function roundTo50(n: number) {
  return Math.round(n / 50) * 50;
}

export function PriceCalculator() {
  const [service, setService] = useState<ServiceKey>("removal");
  const [sizeIndex, setSizeIndex] = useState(1);
  const [nearStructure, setNearStructure] = useState(false);
  const [tightAccess, setTightAccess] = useState(false);

  const config = services[service];
  const size = config.sizes[Math.min(sizeIndex, config.sizes.length - 1)];

  let multiplier = 1;
  if (nearStructure && (service === "removal" || service === "trimming")) multiplier += 0.25;
  if (tightAccess) multiplier += 0.15;

  const low = roundTo50(size.low * multiplier);
  const high = roundTo50(size.high * multiplier);

  const showToggles = service === "removal" || service === "trimming";

  return (
    <div className="overflow-hidden rounded-[22px] border border-forest-900/10 bg-white shadow-soft">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember-600">Ballpark calculator</p>
          <h2 className="mt-2 text-2xl font-bold text-forest-900">Get a rough number in 10 seconds.</h2>

          <p className="mt-5 text-sm font-semibold text-forest-900">What do you need?</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {(Object.keys(services) as ServiceKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setService(key);
                  setSizeIndex(1);
                }}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  service === key
                    ? "bg-forest-900 text-white"
                    : "border border-forest-900/15 bg-white text-forest-900/70 hover:border-forest-600/40 hover:text-forest-900"
                }`}
              >
                {services[key].label}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm font-semibold text-forest-900">{config.sizeLabel}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {config.sizes.map((option, index) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setSizeIndex(index)}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  sizeIndex === index
                    ? "bg-forest-700 text-white"
                    : "border border-forest-900/15 bg-white text-forest-900/70 hover:border-forest-600/40 hover:text-forest-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {showToggles && (
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <Toggle
                checked={nearStructure}
                onChange={setNearStructure}
                label="Near the house or power lines"
              />
              <Toggle checked={tightAccess} onChange={setTightAccess} label="Backyard / tight access" />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center bg-forest-900 p-7 text-white sm:p-9">
          <p className="text-sm font-semibold text-white/60">Your ballpark</p>
          <p className="mt-2 text-4xl font-extrabold tabular-nums sm:text-5xl">
            ${low.toLocaleString()} – ${high.toLocaleString()}
          </p>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Based on typical {config.label.toLowerCase()} jobs in our area. Your written quote pins it down exactly, free.
          </p>
          <a
            href="/quote"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-ember-500 px-6 text-sm font-bold text-white shadow-lg transition hover:bg-ember-600"
          >
            Get My Exact Price →
          </a>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
        checked
          ? "border-forest-600/50 bg-forest-50 text-forest-900"
          : "border-forest-900/15 bg-white text-forest-900/70 hover:border-forest-600/35"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
          checked ? "border-forest-700 bg-forest-700 text-white" : "border-forest-900/25 bg-white text-transparent"
        }`}
      >
        ✓
      </span>
      {label}
    </button>
  );
}
