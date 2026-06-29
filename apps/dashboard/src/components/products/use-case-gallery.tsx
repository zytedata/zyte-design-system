"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getUseCases, type UseCase } from "@/data/use-cases";

export type UseCaseGalleryProps = {
  productLabel: string;
  productSlug: string;
  prototypingEnabled: boolean;
};

/**
 * Outcome-oriented gallery ("What do you want to build?"). Each card hands the
 * user a ready-to-paste starter prompt that references the design system spec,
 * tying the personas to concrete deliverables.
 */
export function UseCaseGallery({
  productLabel,
  productSlug,
  prototypingEnabled,
}: UseCaseGalleryProps) {
  const useCases = getUseCases(productSlug);

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold">What do you want to build?</h2>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          Grab a starter prompt, pair it with <code className="font-mono">design.md</code>{" "}
          from the Vibe coding card above, and let your AI assistant draft it on{" "}
          {productLabel} foundations.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {useCases.map((useCase) => (
          <UseCaseCard
            key={useCase.key}
            useCase={useCase}
            productLabel={productLabel}
            productSlug={productSlug}
            prototypingEnabled={prototypingEnabled}
          />
        ))}
      </div>
    </div>
  );
}

function UseCaseCard({
  useCase,
  productLabel,
  productSlug,
  prototypingEnabled,
}: {
  useCase: UseCase;
  productLabel: string;
  productSlug: string;
  prototypingEnabled: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const Icon = useCase.icon;
  const prompt = useCase.promptTemplate.replaceAll("{product}", productLabel);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable (e.g. insecure context); fail silently.
    }
  }

  return (
    <article className="bg-card flex flex-col rounded-2xl border p-5">
      <header className="flex items-center gap-3">
        <span
          className="bg-muted text-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-xl"
          aria-hidden="true"
        >
          <Icon className="size-4.5" />
        </span>
        <h3 className="text-sm font-semibold">{useCase.title}</h3>
      </header>

      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {useCase.description}
      </p>

      <p className="text-muted-foreground bg-muted/40 mt-3 line-clamp-3 rounded-lg border px-3 py-2 text-xs leading-relaxed">
        {prompt}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          aria-label={`Copy starter prompt for ${useCase.title}`}
        >
          {copied ? (
            <>
              <Check className={cn("size-4 text-emerald-500")} />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copy prompt
            </>
          )}
        </Button>
        {prototypingEnabled ? (
          <Link
            href={`/products/${productSlug}/prototyping`}
            className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-1 text-xs font-medium"
          >
            Open in Prototyping
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
