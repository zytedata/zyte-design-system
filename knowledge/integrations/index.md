---
type: Index
title: Integrations
description: The external systems this repo talks to — the package registry, the deploy target, the Figma plugin, and LLM providers — and how each handles secrets.
tags: [index, integrations]
origin: code
timestamp: 2026-08-29
---

# Integrations

Every boundary where this repo meets an external system, and how its
credentials are handled.

- [github-packages.md](./github-packages.md) — where `@zytedata/*` publishes
  (restricted GitHub Packages) and how consumers authenticate.
- [vercel-deploy.md](./vercel-deploy.md) — how the dashboard deploys (CLI +
  `VERCEL_TOKEN` in `validate.yml`); notes the corrected RELEASING.md deploy history.
- [figma-plugin.md](./figma-plugin.md) — the Figma variable-sync plugin;
  generated-vs-hand-maintained split and its drift risk.
- [llm-providers.md](./llm-providers.md) — the Markdown Studio's OpenAI/Anthropic
  calls and the optional keys that enable them.
