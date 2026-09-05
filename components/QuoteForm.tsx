"use client";

import { useState } from "react";
import { business } from "@/lib/business";
import type { SiteConfig } from "@/lib/site-config";

type Status = "idle" | "submitting" | "success" | "error";

export function QuoteForm({
  compact = false,
  config = business,
  slug
}: {
  compact?: boolean;
  config?: SiteConfig;
  slug?: string;
}) {
  const serviceOptions = config.serviceCards.map((s) => s.title);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slug ? { ...data, slug } : data)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please call us instead.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please call us instead.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[18px] border border-forest-600/25 bg-forest-50 p-8 text-center">
        <p className="text-lg font-bold text-forest-900">Request received.</p>
        <p className="mt-2 text-forest-900/72">
          {config.phone ? (
            <>
              We&apos;ll reach out shortly. Need it faster? Call{" "}
              <a href={`tel:${config.phone}`} className="font-semibold text-forest-700 underline">
                {config.phone}
              </a>
              .
            </>
          ) : (
            <>We&apos;ll reach out shortly.</>
          )}
        </p>
      </div>
    );
  }

  const gap = compact ? "gap-3.5" : "gap-4";

  return (
    <form onSubmit={handleSubmit} className={`grid ${gap}`}>
      <div className={`grid ${gap} sm:grid-cols-2`}>
        <Field label="Your name" required htmlFor="name">
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} placeholder="John Smith" />
        </Field>
        <Field label="Phone" required htmlFor="phone">
          <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} placeholder="(555) 123-4567" />
        </Field>
      </div>

      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="email" className={inputClass} placeholder="your@email.com" />
      </Field>

      <Field label="Property address or area" required htmlFor="address">
        <input id="address" name="address" type="text" required className={inputClass} placeholder="Street, neighborhood, or ZIP" />
      </Field>

      <Field label="Service needed" required htmlFor="service">
        <select id="service" name="service" required className={inputClass} defaultValue="">
          <option value="" disabled>
            Choose a service...
          </option>
          {serviceOptions.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
          <option value="Not sure">Not sure yet</option>
        </select>
      </Field>

      <Field label="Description" htmlFor="notes">
        <textarea
          id="notes"
          name="notes"
          rows={compact ? 2 : 4}
          className={inputClass}
          placeholder="Tell us about the tree: size, location, how urgent it is"
        />
      </Field>

      {status === "error" && (
        <p className="rounded-xl bg-ember-500/10 px-4 py-3 text-sm font-semibold text-ember-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 inline-flex h-13 items-center justify-center rounded-2xl bg-ember-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-ember-600/20 transition hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Get My Free Quote"}
      </button>
      <p className="text-center text-xs text-forest-900/55">
        Free estimate · No pressure
        {config.phone && (
          <>
            {" · "}Or call{" "}
            <a href={`tel:${config.phone}`} className="font-semibold text-forest-700 underline">
              {config.phone}
            </a>
          </>
        )}
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-forest-900/15 bg-white px-3.5 py-2.5 text-[15px] text-forest-900 shadow-sm outline-none transition placeholder:text-forest-900/40 focus:border-forest-600/50 focus:ring-2 focus:ring-forest-600/20";

function Field({
  label,
  htmlFor,
  required = false,
  children
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="grid gap-1.5 text-sm font-semibold text-forest-900">
      <span>
        {label}
        {required && <span className="text-ember-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
