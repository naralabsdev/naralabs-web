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

MSG='chore: update env example with APP_BASE_URL' && commit .env.example
MSG='chore: add radix presence patch script' && commit scripts/patch-radix-presence.mjs
MSG='chore: add radix slot patch script' && commit scripts/patch-radix-slot.mjs
MSG='chore: update package scripts and dependencies' && commit package.json package-lock.json
MSG='chore: add favicon redirect in next config' && commit next.config.ts
MSG='chore: update favicon generation for brand folder' && commit scripts/generate-favicons.mjs
MSG='chore: extend middleware for password reset routes' && commit src/middleware.ts

MSG='feat(brand): refresh full wordmark dark logo' && commit public/logo-dark.png
MSG='feat(brand): refresh full wordmark light logo' && commit public/logo-light.png
MSG='feat(brand): refresh single mark dark logo' && commit public/logo-single-dark.png
MSG='feat(brand): refresh single mark light logo' && commit public/logo-single-light.png
MSG='feat(brand): add optimized favicon asset set' && commit public/favicon/
MSG='feat(brand): remove legacy root favicon png files' && commit public/apple-icon.png public/favicon.ico public/icon.png
MSG='feat(brand): add centralized favicon metadata config' && commit src/shared/config/favicons.ts
MSG='feat(brand): wire favicon manifest in site layout' && commit src/app/\(site\)/layout.tsx src/app/\(docs\)/layout.tsx
MSG='feat(brand): update construct-metadata favicon defaults' && commit src/shared/lib/functions/construct-metadata.ts
MSG='style(nav): set navigation progress bar to white' && commit public/navigation-progress.js

MSG='feat(aurora): add shared brand aurora theme palette' && commit src/modules/landing/components/hero/aurora-themes.ts
MSG='style(landing): align hero aurora background with brand colors' && commit src/modules/landing/styles/marketing.css
MSG='feat(aurora): pass theme through aurora background component' && commit src/modules/landing/components/hero/aurora-background.tsx
MSG='feat(aurora): support themed hero gradient renderer' && commit src/modules/landing/components/hero/hero-gradient/hero-gradient-background.tsx
MSG='feat(explore): add aurora backdrop strip for explorer pages' && commit src/modules/explore/components/explorer-aurora-backdrop.tsx

MSG='feat(docs-link): add docs external link helper' && commit src/shared/lib/docs-link.ts
MSG='feat(nav): open docs links in new tab from navbar' && commit src/shared/ui/nav/nav.tsx src/shared/ui/nav/nav-mobile.tsx
MSG='feat(nav): update explore nav items and footer links' && commit src/modules/landing/components/chrome/nav-items.ts src/modules/landing/components/chrome/footer.tsx
MSG='feat(nav): update product and resources menu docs links' && commit src/modules/landing/components/chrome/product-menu-content.tsx src/shared/ui/nav/content/product-content.tsx src/shared/ui/nav/content/resources-content.tsx

MSG='feat(explore): add explorer page copy constants' && commit src/modules/explore/constants/
MSG='feat(explore): add list page layout with aurora header' && commit src/modules/explore/components/explorer-list-page-layout.tsx
MSG='feat(explore): add detail page layout with aurora header' && commit src/modules/explore/components/explorer-detail-page-layout.tsx
MSG='feat(explore): add flat list section surface helper' && commit src/modules/explore/components/explorer-list-section.tsx
MSG='feat(explore): refine explorer page header typography' && commit src/modules/explore/components/explorer-page-header.tsx
MSG='feat(explore): update explorer page shell chrome' && commit src/modules/explore/components/explorer-page-shell.tsx
MSG='feat(explore): add landing card surface tokens' && commit src/shared/ui/landing-card-surface.ts

MSG='feat(events): adopt aurora list layout on events page' && commit src/modules/events/components/events-list-page.tsx src/app/\(site\)/events/page.tsx
MSG='feat(events): simplify events list panel without stat grid' && commit src/modules/events/components/events-list-panel.tsx
MSG='feat(events): adopt aurora detail layout on event page' && commit src/modules/events/components/event-detail-page.tsx
MSG='feat(events): update event overview summary hierarchy' && commit src/modules/events/components/event-overview-summary.tsx src/modules/events/components/detail-field-row.tsx

MSG='feat(contracts): adopt aurora list layout on contracts page' && commit src/modules/contracts/components/contracts-list-page.tsx src/app/\(site\)/contracts/page.tsx
MSG='feat(contracts): simplify contracts list panel' && commit src/modules/contracts/components/contracts-list-panel.tsx src/modules/contracts/components/contract-events-panel.tsx src/modules/contracts/components/contract-events-table.tsx
MSG='feat(contracts): adopt aurora detail layout on contract page' && commit src/modules/contracts/components/contract-detail-page.tsx src/app/\(site\)/contracts/\[id\]/page.tsx
MSG='feat(contracts): add published schemas section on contract detail' && commit src/modules/contracts/components/contract-published-schemas-section.tsx
MSG='feat(contracts): update contract overview and field tips' && commit src/modules/contracts/components/contract-overview-summary.tsx src/modules/contracts/constants/field-tips.ts src/modules/contracts/domain/contract-view-model.ts src/modules/contracts/domain/map-contract-detail.ts

MSG='feat(schemas): add public schema registry routes' && commit src/app/\(site\)/schemas/
MSG='feat(registry): add schema registry domain layer' && commit src/modules/registry/domain/
MSG='feat(registry): add schema registry services' && commit src/modules/registry/services/
MSG='feat(registry): add schema registry UI components' && commit src/modules/registry/components/
MSG='feat(registry): add registry BFF proxy routes' && commit src/app/api/registry/

MSG='feat(hero): add Etherscan-style hero search dropdown' && commit src/modules/landing/components/hero/hero-search-dropdown.tsx
MSG='feat(hero): improve hero search overlay and open state' && commit src/modules/landing/components/hero/hero-search-block.tsx src/modules/landing/components/hero/hero-section.tsx
MSG='feat(landing): add live websocket home dashboard' && commit src/modules/landing/components/live/ src/modules/landing/hooks/
MSG='feat(landing): wire homepage through live dashboard' && commit src/modules/landing/components/landing-page.tsx
MSG='feat(landing): add animated network chart helpers' && commit src/modules/landing/components/network/chart-geometry.ts src/modules/landing/components/network/use-animated-chart-series.ts src/modules/landing/components/network/transaction-history-chart.tsx
MSG='feat(landing): refresh activity section and dicebear avatars' && commit src/modules/landing/components/activity/ src/modules/landing/components/shared/landing-info-tooltip.tsx
MSG='feat(landing): update network stats section layout' && commit src/modules/landing/components/network/network-stats-section.tsx
MSG='feat(landing): extend homepage content and home payload mapping' && commit src/modules/landing/constants/homepage-content.ts src/modules/landing/domain/home-view-model.ts src/modules/landing/domain/map-home-payload.ts

MSG='feat(ui): add animated number and text primitives' && commit src/shared/ui/animated-number.tsx src/shared/ui/animated-text.tsx
MSG='feat(ui): add animated table row helpers' && commit src/shared/ui/explorer-table/animated-table-row.tsx src/shared/ui/explorer-table/use-appended-row-ids.ts
MSG='feat(ui): refresh explorer table components' && commit src/shared/ui/explorer-table/
MSG='feat(ui): add field styles and simple select' && commit src/shared/ui/field-styles.ts src/shared/ui/simple-select.tsx
MSG='feat(ui): add soroban contract id helper' && commit src/shared/lib/soroban-contract-id.ts
MSG='feat(ui): polish shared button input and tooltip styles' && commit src/shared/ui/button.tsx src/shared/ui/input.tsx src/shared/ui/tooltip.tsx src/shared/ui/footer.tsx src/shared/ui/index.ts src/app/globals.css

MSG='feat(auth): extend auth error codes for security flows' && commit src/modules/auth/constants/auth-errors.ts
MSG='feat(auth): add forgot password link on login form' && commit src/modules/auth/components/login-form.tsx src/modules/auth/components/auth-transition-link.tsx
MSG='feat(auth): add logout helper' && commit src/modules/auth/lib/logout.ts
MSG='feat(security): add password form schemas and copy' && commit src/modules/security/lib/ src/modules/security/constants/
MSG='feat(security): add change forgot and reset password forms' && commit src/modules/security/components/
MSG='feat(security): add password auth BFF routes' && commit src/app/api/auth/change-password/ src/app/api/auth/forgot-password/ src/app/api/auth/reset-password/
MSG='feat(security): add forgot and reset password pages' && commit src/app/\(site\)/forgot-password/ src/app/\(site\)/reset-password/
MSG='feat(dashboard): add security settings page' && commit src/app/\(site\)/dashboard/settings/security/
MSG='feat(dashboard): simplify profile settings page' && commit src/app/\(site\)/dashboard/settings/profile/page.tsx
MSG='feat(dashboard): reorganize dashboard navigation groups' && commit src/app/\(site\)/dashboard/constants.ts src/app/\(site\)/dashboard/layout-client.tsx
MSG='feat(dashboard): remove unused placeholder dashboard pages' && commit src/app/\(site\)/dashboard/notes/page.tsx src/app/\(site\)/dashboard/tags/page.tsx src/app/\(site\)/dashboard/verified-addresses/page.tsx src/app/\(site\)/dashboard/watchlist/page.tsx
MSG='feat(dashboard): simplify account overview page' && commit src/app/\(site\)/dashboard/page.tsx

MSG='feat(developers): add API dashboard module' && commit src/modules/developers/
MSG='feat(developers): add developers dashboard route' && commit src/app/\(site\)/dashboard/developers/page.tsx
MSG='feat(developers): add dashboard schema registry pages' && commit src/app/\(site\)/dashboard/schemas/
MSG='feat(api-keys): add API keys BFF proxy routes' && commit src/app/api/api-keys/

MSG='feat(infra): extend atlas proxy helpers' && commit src/shared/infra/proxy-atlas.ts src/shared/infra/proxy-atlas-auth.ts src/shared/config/env.ts
MSG='feat(infra): update atlas BFF catch-all route' && commit src/app/api/atlas/\[...path\]/route.ts
MSG='feat(docs): add authentication decode and quickstart guides' && commit src/content/api/authentication.mdx src/content/api/decode-api.mdx src/content/api/quickstart.mdx
MSG='feat(docs): update API overview and events docs' && commit src/content/api/overview.mdx src/content/api/events-api.mdx src/content/api/_meta.js src/content/guides/decoding-events.mdx

MSG='chore(explore): remove unused explorer stat grid components' && commit src/modules/explore/components/explorer-stat-grid.tsx src/modules/explore/components/explorer-stat-card.tsx src/modules/explore/components/explorer-table-card.tsx
MSG='chore(lib): update shared time-ago and function exports' && commit src/shared/lib/functions/time-ago.ts src/shared/lib/functions/index.ts
MSG='style(hero): update button link styling' && commit src/modules/landing/components/hero/button-link.tsx
MSG='style(nav): polish shared nav content layout' && commit src/shared/ui/nav/content/shared.tsx src/shared/ui/nav/user-menu.tsx

echo "Frontend commits in session: $(git rev-list --count HEAD~60..HEAD 2>/dev/null || git rev-list --count HEAD)"
