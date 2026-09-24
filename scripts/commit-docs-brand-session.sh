#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

commit() {
  git add "$@"
  if git diff --cached --quiet; then
    echo "skip (empty): $MSG"
    return 0
  fi
  git commit -m "$MSG"
}

MSG='chore: document APP_BASE_URL and realtime WS in env example' && commit .env.example
MSG='docs: update README for local setup and env vars' && commit README.md

MSG='feat(brand): add shared brand color tokens module' && commit src/shared/config/brand.ts
MSG='feat(brand): add CSS variables for gradient and palette' && commit src/shared/styles/brand.css
MSG='style(brand): wire brand tokens into global styles' && commit src/app/globals.css
MSG='chore(tailwind): expose brand button gradient utility' && commit tailwind.config.ts
MSG='style(ui): apply brand gradient and disabled opacity on buttons' && commit src/shared/ui/button.tsx

MSG='fix(realtime): resolve public WebSocket base URL in browser' && commit src/shared/config/env.ts
MSG='fix(realtime): connect home dashboard to derived WS URL' && commit src/modules/landing/hooks/use-home-websocket.ts

MSG='feat(docs): strip app routes from docs sidebar page map' && commit src/app/\(docs\)/filter-docs-page-map.ts
MSG='feat(docs): use wordmark logo and sidebar collapse defaults' && commit src/app/\(docs\)/layout.tsx
MSG='style(docs): flat sidebar sections and navbar logo hover' && commit src/app/\(docs\)/docs/docs.css

MSG='feat(docs): flatten sidebar with section separators' && commit src/content/_meta.js
MSG='feat(docs): refresh documentation home overview' && commit src/content/index.mdx

MSG='feat(docs): reorganize getting-started section meta' && commit src/content/getting-started/_meta.js
MSG='feat(docs): move decoding guide into getting-started' && commit src/content/getting-started/decoding-events.mdx
MSG='docs(getting-started): update networks page copy' && commit src/content/getting-started/networks.mdx
MSG='chore(docs): remove redundant getting-started introduction' && commit src/content/getting-started/introduction.mdx

MSG='chore(docs): remove standalone guides section' && commit src/content/guides/_meta.js src/content/guides/decoding-events.mdx

MSG='feat(docs): add explorer schemas documentation page' && commit src/content/explorer/schemas.mdx
MSG='feat(docs): update explorer section navigation meta' && commit src/content/explorer/_meta.js
MSG='docs(explorer): polish overview contracts and events pages' && commit src/content/explorer/overview.mdx src/content/explorer/contracts.mdx src/content/explorer/events.mdx

MSG='feat(docs): add API credentials guide replacing auth flow doc' && commit src/content/api/api-credentials.mdx
MSG='chore(docs): remove login-oriented authentication doc' && commit src/content/api/authentication.mdx
MSG='feat(docs): update Atlas API section meta' && commit src/content/api/_meta.js
MSG='docs(api): expand API overview and quickstart' && commit src/content/api/overview.mdx src/content/api/quickstart.mdx
MSG='docs(api): refine decode API reference page' && commit src/content/api/decode-api.mdx
MSG='chore(docs): remove duplicate events and contracts API pages' && commit src/content/api/events-api.mdx src/content/api/contracts-api.mdx

MSG='style(landing): align aurora theme with brand palette' && commit src/modules/landing/components/hero/aurora-themes.ts
MSG='style(landing): tweak marketing surface styles' && commit src/modules/landing/styles/marketing.css
MSG='style(hero): update hero CTA button link styling' && commit src/modules/landing/components/hero/button-link.tsx
MSG='style(hero): adjust hero search dropdown chrome' && commit src/modules/landing/components/hero/hero-search-dropdown.tsx
MSG='style(landing): sync nav feature graphic accent' && commit src/modules/landing/components/chrome/nav-feature-graphics.tsx
MSG='style(landing): sync payment gateway feature graphic' && commit src/modules/landing/components/features/feature-graphics/payment-gateway.tsx

MSG='style(ui): extend animated empty state styling' && commit src/shared/ui/animated-empty-state.tsx
MSG='style(ui): polish filter list and option row' && commit src/shared/ui/filter/filter-list.tsx src/shared/ui/filter/filter-option-row.tsx
MSG='style(ui): polish filter select control' && commit src/shared/ui/filter/filter-select.tsx
MSG='style(nav): mobile nav layout tweak' && commit src/shared/ui/nav/nav-mobile.tsx

echo "Session commits: $(git rev-list --count origin/main..HEAD 2>/dev/null || echo '?')"
