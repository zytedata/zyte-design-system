"use client";

import React from "react";

const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <section className="ds-section border-b border-border-subtle last:border-b-0">
    <div className="ds-container space-y-4">
      <header className="space-y-2">
        <h2 className="ds-heading-md">{title}</h2>
        {description ? <p className="ds-text-small max-w-2xl">{description}</p> : null}
      </header>
      <div className="space-y-6">{children}</div>
    </div>
  </section>
);

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-surface-main text-text-main">
      {/* Hero */}
      <section className="ds-section">
        <div className="ds-container space-y-6">
          <p className="ds-text-label">Design system</p>
          <h1 className="ds-heading-display">Zyte design system showcase</h1>
          <p className="ds-text-lead max-w-2xl">
            A reference page that demonstrates the core primitives of the Zyte design system
            implemented in Tailwind CSS: typography, layout, color, buttons, cards, banners,
            tables, pills, and skeletons.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="ds-button ds-button--primary">Primary action</button>
            <button className="ds-button ds-button--secondary">Secondary action</button>
            <button className="ds-button ds-button--ghost">Ghost action</button>
          </div>
        </div>
      </section>

      {/* Typography */}
      <Section
        title="Typography"
        description="Headings and text styles built on Yellix and Space Mono, aligned to Zyte.com."
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="ds-text-label">Headings</p>
            <div className="space-y-4">
              <div>
                <p className="ds-text-hint mb-1">ds-heading-display</p>
                <h2 className="ds-heading-display">Full-stack web data for serious teams</h2>
              </div>
              <div>
                <p className="ds-text-hint mb-1">ds-heading-xl</p>
                <h2 className="ds-heading-xl">Enterprise-grade web scraping platform</h2>
              </div>
              <div>
                <p className="ds-text-hint mb-1">ds-heading-lg</p>
                <h3 className="ds-heading-lg">Built on battle-tested infrastructure</h3>
              </div>
              <div>
                <p className="ds-text-hint mb-1">ds-heading-md</p>
                <h4 className="ds-heading-md">Key capabilities</h4>
              </div>
              <div>
                <p className="ds-text-hint mb-1">ds-heading-sm</p>
                <h5 className="ds-heading-sm">Section label</h5>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <p className="ds-text-label">Body text</p>
              <p className="ds-text-lead">
                Zyte provides rock-solid, reliable web data at scale, helping data teams move from
                brittle scrapers to production-grade web data pipelines.
              </p>
              <p className="ds-text-body">
                Use <code className="ds-text-mono">ds-text-body</code> for most body copy, and
                <code className="ml-1 ds-text-mono">ds-text-lead</code> for introductory paragraphs
                and hero copy.
              </p>
              <p className="ds-text-small">
                Small text and helper copy use <code className="ds-text-mono">ds-text-small</code>.
              </p>
            </div>

            <div className="space-y-3">
              <p className="ds-text-label">Supporting styles</p>
              <p className="ds-text-caption">Caption text uses ds-text-caption.</p>
              <p className="ds-text-hint">Hint text uses ds-text-hint.</p>
              <p className="ds-text-label">Label text uses ds-text-label.</p>
              <p className="ds-text-mono">Mono text uses ds-text-mono (Space Mono).</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Color & Pills */}
      <Section
        title="Pills and color accents"
        description="Topic pills and text colors built on Zyte brand and text palettes."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="ds-text-label">Topic pills</p>
            <div className="flex flex-wrap gap-3">
              <span className="ds-pill">Web scraping</span>
              <span className="ds-pill">E-commerce</span>
              <span className="ds-pill">News &amp; media</span>
              <span className="ds-pill">AI training data</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="ds-text-label">Text color examples</p>
            <div className="grid gap-3 md:grid-cols-2">
              <p className="ds-text-body text-text-700">
                Text 700 – used for primary headings and strong text.
              </p>
              <p className="ds-text-body text-text-500">
                Text 500 – used for body copy and paragraphs.
              </p>
              <p className="ds-text-body text-text-400">
                Text 400 – used for secondary and muted content.
              </p>
              <p className="ds-text-body text-interactive-success-500">
                Success 500 – used for positive status and confirmations.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Status colors"
        description="Interactive palettes for info, success, warning, and error states."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="ds-text-label">Text tokens</p>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <p className="ds-text-body text-interactive-info-500">Info 500 – inline links, notices.</p>
              <p className="ds-text-body text-interactive-success-500">
                Success 500 – confirmations, positive KPIs.
              </p>
              <p className="ds-text-body text-interactive-warning-500">Warning 500 – cautions and notices.</p>
              <p className="ds-text-body text-interactive-error-500">Error 500 – failures and blocking errors.</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="ds-text-label">Background tokens</p>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-lg bg-interactive-info-100 px-4 py-3">
                <p className="ds-text-small text-interactive-info-700">Info 100 / 700</p>
              </div>
              <div className="rounded-lg bg-interactive-success-100 px-4 py-3">
                <p className="ds-text-small text-interactive-success-700">Success 100 / 700</p>
              </div>
              <div className="rounded-lg bg-interactive-warning-100 px-4 py-3">
                <p className="ds-text-small text-interactive-warning-700">Warning 100 / 700</p>
              </div>
              <div className="rounded-lg bg-interactive-error-100 px-4 py-3">
                <p className="ds-text-small text-interactive-error-700">Error 100 / 700</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section
        title="Buttons"
        description="Button primitives for primary, secondary, ghost, and link-style actions."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="ds-text-label">Primary actions</p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="ds-button ds-button--primary">Get started</button>
              <button className="ds-button ds-button--primary ds-button--lg">
                Get started (large)
              </button>
              <button className="ds-button ds-button--primary ds-button--sm">
                Get started (small)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="ds-text-label">Secondary and ghost</p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="ds-button ds-button--secondary">Talk to sales</button>
              <button className="ds-button ds-button--ghost">Learn more</button>
              <button className="ds-button ds-button--link">
                <span>View documentation</span>
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Cards & Layout */}
      <Section
        title="Cards and layout"
        description="Card primitives and layout helpers for common marketing and product sections."
      >
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="ds-card space-y-3">
              <span className="ds-pill">Zyte API</span>
              <h3 className="ds-heading-sm">Full-stack web scraping</h3>
              <p className="ds-text-body">
                Avoid bans, use headless browsers, and parse pages with AI in a single API.
              </p>
              <button className="ds-button ds-button--link">
                <span>Explore Zyte API</span>
              </button>
            </div>

            <div className="ds-card space-y-3">
              <span className="ds-pill">Scrapy Cloud</span>
              <h3 className="ds-heading-sm">Run spiders at scale</h3>
              <p className="ds-text-body">
                Run, monitor, and control Scrapy spiders with production-grade infrastructure.
              </p>
              <button className="ds-button ds-button--link">
                <span>View Scrapy Cloud</span>
              </button>
            </div>

            <div className="ds-card space-y-3">
              <span className="ds-pill">Web Scraping Copilot</span>
              <h3 className="ds-heading-sm">AI-assisted scraping</h3>
              <p className="ds-text-body">
                The complete spider workflow from AI-generated code to cloud deployment.
              </p>
              <button className="ds-button ds-button--link">
                <span>Discover Copilot</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="ds-text-label">Section spacing helpers</p>
            <div className="space-y-3">
              <div className="bg-surface-muted">
                <div className="ds-section-tight">
                  <div className="ds-container">
                    <p className="ds-text-small">ds-section-tight</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-muted">
                <div className="ds-section-loose">
                  <div className="ds-container">
                    <p className="ds-text-small">ds-section-loose</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Banners */}
      <Section
        title="Banners"
        description="Top-of-page announcement bars with Zyte brand variants."
      >
        <div className="space-y-4">
          <div className="ds-banner ds-banner--primary rounded-xl">
            <p className="ds-text-small">
              Explore 2026 web scraping trends and get early access to Zyte&apos;s industry report.
            </p>
            <button className="ds-button ds-button--secondary ds-button--sm">Register now</button>
          </div>

          <div className="ds-banner ds-banner--success rounded-xl">
            <p className="ds-text-small">All systems operational. No scraping incidents reported.</p>
            <button className="ds-button ds-button--secondary ds-button--sm">View status page</button>
          </div>

          <div className="ds-banner ds-banner--warm rounded-xl">
            <p className="ds-text-small">New: Web Scraping Copilot for VS Code is now in beta.</p>
            <button className="ds-button ds-button--secondary ds-button--sm">Try Copilot</button>
          </div>

          <div className="ds-banner ds-banner--cool rounded-xl">
            <p className="ds-text-small">See how data teams use Zyte in our latest case studies.</p>
            <button className="ds-button ds-button--secondary ds-button--sm">View case studies</button>
          </div>
        </div>
      </Section>

      {/* Tables */}
      <Section
        title="Tables"
        description="Data tables styled with Zyte table primitives."
      >
        <div className="ds-card overflow-x-auto">
          <table className="ds-table min-w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Primary use case</th>
                <th>Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Zyte API</th>
                <td>Full-stack web scraping with bans, headless browser, and AI parsing.</td>
                <td>Teams that need a single endpoint for complex web data.</td>
              </tr>
              <tr>
                <th>Scrapy Cloud</th>
                <td>Running and managing spiders at scale.</td>
                <td>Engineering teams with existing Scrapy projects.</td>
              </tr>
              <tr>
                <th>Web Scraping Copilot</th>
                <td>AI-assisted spider creation and deployment from VS Code.</td>
                <td>Developers building and iterating on scrapers quickly.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Skeletons */}
      <Section
        title="Skeletons"
        description="Loading states using the Zyte skeleton gradient."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="ds-card space-y-4">
            <p className="ds-text-label">Card skeleton</p>
            <div className="space-y-3">
              <div className="ds-skeleton h-6 w-1/3 rounded-md" />
              <div className="ds-skeleton h-4 w-2/3 rounded-md" />
              <div className="ds-skeleton h-4 w-full rounded-md" />
              <div className="ds-skeleton h-4 w-5/6 rounded-md" />
            </div>
          </div>

          <div className="ds-card space-y-4">
            <p className="ds-text-label">Table skeleton</p>
            <div className="space-y-2">
              <div className="ds-skeleton h-4 w-full rounded-md" />
              <div className="ds-skeleton h-4 w-full rounded-md" />
              <div className="ds-skeleton h-4 w-11/12 rounded-md" />
              <div className="ds-skeleton h-4 w-10/12 rounded-md" />
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
