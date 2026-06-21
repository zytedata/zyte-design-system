import type { CSSProperties } from "react";

/**
 * Standalone demo page for the Markdown Studio export.
 *
 * IMPORTANT: this page is intentionally self-contained. It does NOT import
 * anything from the design system (no @zytedata/ds-* packages, no foundations).
 * Every value below is transcribed directly from the YAML token block that was
 * embedded in the pasted markdown — the point is to prove that a copy/paste of
 * the studio output is enough to reproduce the look and feel elsewhere.
 */

// --- Tokens (verbatim from the pasted design system reference) ---------------
const T = {
  // colors.primary — Zyte Fuchsia
  primary500: "#d946ef",
  primary600: "#c026d3",
  primary700: "#a21caf",
  // colors.accentSecondary — Orange
  accentSecondary500: "#e8520a",
  // colors.headlineGradient
  headlineGradient: "linear-gradient(90deg, #e8520a 0%, #c026d3 100%)",
  // colors.surfaceLight
  background: "#f7f7f8",
  pageSections: "#f0f0f2",
  surfaceSecondary: "#e8e8ec",
  cards: "#ffffff",
  // colors.neutral
  border: "#E5E5E5",
  textStrong: "#171717",
  text: "#404040",
  muted: "#525252",
  subtle: "#737373",
  // family
  sans: 'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  // radius
  radiusLg: 8,
  radiusXl: 12,
  radius2xl: 16,
  // shadow
  shadowSm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  shadowMd:
    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  shadowLg:
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
} as const;

const VALUE_PROPS: { title: string; body: string }[] = [
  {
    title: "Effortless Data Extraction",
    body: "Simplify your data collection with our easy-to-use API that allows you to extract data from any website without hassle.",
  },
  {
    title: "Real-Time Data Access",
    body: "Stay ahead of the competition with real-time data scraping capabilities that keep your information up to date.",
  },
  {
    title: "Scalable Solutions",
    body: "Whether you are a small startup or a large enterprise, our API scales with your needs, ensuring you always have access to the data you need.",
  },
  {
    title: "Comprehensive Documentation",
    body: "Get started quickly with our in-depth documentation and tutorials that guide you through every step of the integration process.",
  },
  {
    title: "Dedicated Support",
    body: "Our expert support team is available 24/7 to assist you with any issues or questions you may have.",
  },
];

const FEATURES: { title: string; body: string }[] = [
  {
    title: "Customizable Scraping Options",
    body: "Tailor your scraping requests with various parameters to get exactly the data you need.",
  },
  {
    title: "Data Processing & Cleaning",
    body: "Automatically clean and format your data as it is scraped, saving you time on post-processing.",
  },
  {
    title: "IP Rotation & Proxy Management",
    body: "Ensure your scraping remains undetected with built-in IP rotation and proxy management features.",
  },
  {
    title: "User-Friendly Dashboard",
    body: "Manage your scraping tasks and monitor performance through our intuitive dashboard.",
  },
  {
    title: "Robust Security Measures",
    body: "Protect your data with our secure API that follows industry best practices for data safety.",
  },
];

const COMPANIES = ["Northwind", "Acme Data", "Lumen", "Vela", "Quanta"];

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="/sign-up"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: T.primary600,
        color: "#ffffff",
        fontWeight: 600,
        fontSize: 16,
        padding: "12px 24px",
        borderRadius: T.radiusLg,
        boxShadow: T.shadowSm,
        textDecoration: "none",
      }}
    >
      Get started
      <span aria-hidden="true">→</span>
    </a>
  );
}

export default function TestPage() {
  const pageStyle: CSSProperties = {
    background: T.background,
    color: T.text,
    fontFamily: T.sans,
    minHeight: "100vh",
  };

  return (
    <main style={pageStyle}>
      {/* Hero */}
      <section
        style={{
          borderBottom: `1px solid ${T.border}`,
          background: `radial-gradient(60% 80% at 30% 0%, ${T.pageSections} 0%, ${T.background} 70%)`,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "96px 24px 80px",
          }}
        >
          <p
            style={{
              fontFamily: T.mono,
              fontSize: 12,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              color: T.subtle,
              margin: 0,
            }}
          >
            Zyte · Web-Scraping API
          </p>

          <h1
            style={{
              fontSize: 60,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -0.8,
              color: T.textStrong,
              margin: "24px 0 0",
              maxWidth: 880,
            }}
          >
            Powerful Web-Scraping API for{" "}
            <span
              style={{
                backgroundImage: T.headlineGradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Data Teams
            </span>
          </h1>

          <p
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              color: T.muted,
              margin: "24px 0 0",
              maxWidth: 680,
            }}
          >
            Transform your data collection process with our robust web-scraping
            API designed specifically for data teams. Seamlessly extract,
            process, and analyze data from any website.
          </p>

          <div style={{ marginTop: 40 }}>
            <PrimaryButton>Get started</PrimaryButton>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: -0.4,
            color: T.textStrong,
            margin: "0 0 40px",
          }}
        >
          Why Choose Our Web-Scraping API?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {VALUE_PROPS.map((item) => (
            <article
              key={item.title}
              style={{
                background: T.cards,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius2xl,
                padding: 24,
                boxShadow: T.shadowSm,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: 32,
                  height: 4,
                  borderRadius: 9999,
                  backgroundImage: T.headlineGradient,
                  marginBottom: 16,
                }}
              />
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: T.textStrong,
                  margin: "0 0 8px",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.625, color: T.muted, margin: 0 }}>
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Trusted by */}
      <section
        style={{
          background: T.pageSections,
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px" }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: T.subtle,
              textAlign: "center",
              margin: "0 0 28px",
            }}
          >
            Trusted by Leading Companies
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            {COMPANIES.map((name) => (
              <span
                key={name}
                style={{
                  fontFamily: T.mono,
                  fontSize: 16,
                  fontWeight: 500,
                  color: T.text,
                  background: T.cards,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radiusXl,
                  padding: "10px 20px",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: -0.4,
            color: T.textStrong,
            margin: "0 0 40px",
          }}
        >
          Features of Our API
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((item, index) => (
            <article
              key={item.title}
              style={{
                background: T.cards,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius2xl,
                padding: 24,
                boxShadow: T.shadowSm,
              }}
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.accentSecondary500,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: T.textStrong,
                  margin: "12px 0 8px",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.625, color: T.muted, margin: 0 }}>
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "0 24px 96px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: T.radius2xl,
            padding: "64px 40px",
            textAlign: "center",
            backgroundImage: T.headlineGradient,
            boxShadow: T.shadowLg,
          }}
        >
          <h2
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: -0.4,
              color: "#ffffff",
              margin: 0,
            }}
          >
            Start Scraping Today!
          </h2>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.625,
              color: "rgba(255,255,255,0.92)",
              margin: "16px auto 32px",
              maxWidth: 620,
            }}
          >
            Ready to elevate your data collection process? Sign up for our
            web-scraping API and explore the endless possibilities of data at
            your fingertips.
          </p>
          <a
            href="/sign-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#ffffff",
              color: T.primary700,
              fontWeight: 600,
              fontSize: 16,
              padding: "12px 24px",
              borderRadius: T.radiusLg,
              textDecoration: "none",
              boxShadow: T.shadowSm,
            }}
          >
            Get started
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
