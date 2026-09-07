#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

commit() {
  git add "$@"
  git commit -m "$MSG"
}

MSG='chore: add npmrc for dependency resolution' && commit .npmrc
MSG='chore: configure project scripts and dependencies' && commit package.json
MSG='chore: update lockfile for dependency tree' && commit package-lock.json
MSG='chore: configure TypeScript compiler options' && commit tsconfig.json
MSG='chore: configure Next.js dev headers and compiler' && commit next.config.ts
MSG='chore: add Tailwind CSS configuration' && commit tailwind.config.ts
MSG='chore: migrate PostCSS config to CommonJS' && commit postcss.config.js && git add -u postcss.config.mjs

MSG='chore: add CSS import validation script' && commit scripts/validate-css-imports.mjs
MSG='chore: add CSS compile validation script' && commit scripts/validate-css-compile.mjs
MSG='chore: add production start validation script' && commit scripts/validate-start.mjs
MSG='chore: add favicon generation script' && commit scripts/generate-favicons.mjs

MSG='feat(brand): add full wordmark logo assets' && commit public/logo-dark.png public/logo-light.png
MSG='feat(brand): add single mark logo sources' && commit public/logo-single-dark.png public/logo-single-light.png
MSG='feat(brand): add optimized favicon assets' && commit public/favicon.ico public/icon.png public/apple-icon.png
MSG='feat(nav): add client-side navigation progress script' && commit public/navigation-progress.js
MSG='feat(marketing): add partner logo assets' && commit public/marketing/logos/
MSG='feat(marketing): add hero and analytics imagery' && commit public/marketing/analytics.png public/marketing/hero.png
MSG='feat(marketing): add payment lottie animations' && commit public/lottie/

MSG='feat(types): add ambient module declarations' && commit src/types/
MSG='feat(config): add site and environment helpers' && commit src/shared/config/
MSG='feat(infra): add Atlas fetch and proxy helpers' && commit src/shared/infra/
MSG='feat(lib): add shared constants' && commit src/shared/lib/constants/
MSG='feat(lib): add shared utility functions' && commit src/shared/lib/functions/ src/shared/lib/cn.ts src/shared/lib/index.ts

MSG='style(app): refresh global stylesheet' && commit src/app/globals.css
MSG='feat(app): configure root layout metadata and icons' && commit src/app/layout.tsx && git add -u src/app/favicon.ico
MSG='feat(app): add client providers shell' && commit src/app/providers.tsx src/app/navigation-progress-script.tsx
MSG='feat(app): wire homepage to landing module' && commit src/app/page.tsx
MSG='feat(api): add Atlas BFF proxy route' && commit src/app/api/

MSG='feat(landing): add marketing fonts and styles' && commit src/modules/landing/fonts.ts src/modules/landing/Satoshi-Variable.woff2 src/modules/landing/styles/
MSG='feat(landing): add homepage content constants' && commit src/modules/landing/constants/ src/modules/landing/domain/ src/modules/landing/index.ts
MSG='feat(landing): add marketing chrome and navigation items' && commit src/modules/landing/components/chrome/
MSG='feat(landing): add aurora hero gradient renderer' && commit src/modules/landing/components/hero/hero-gradient/
MSG='feat(landing): add hero section and search UI' && commit src/modules/landing/components/hero/aurora-background.tsx src/modules/landing/components/hero/hero-section.tsx src/modules/landing/components/hero/hero-nav.tsx src/modules/landing/components/hero/hero-search-block.tsx src/modules/landing/components/hero/hero-showcase.tsx src/modules/landing/components/hero/hero-rotating-word.tsx src/modules/landing/components/hero/button-link.tsx
MSG='feat(landing): add recent activity section' && commit src/modules/landing/components/activity/
MSG='feat(landing): add network stats section' && commit src/modules/landing/components/network/
MSG='feat(landing): add logos and feature showcase sections' && commit src/modules/landing/components/logos/ src/modules/landing/components/features/ src/modules/landing/components/landing-page.tsx

MSG='feat(events): add event detail domain and services' && commit src/modules/events/
MSG='feat(events): add event detail app routes' && commit src/app/events/
MSG='feat(contracts): add contract detail domain and services' && commit src/modules/contracts/
MSG='feat(contracts): add contract detail app routes' && commit src/app/contracts/

MSG='feat(ui): add shared hooks' && commit src/shared/ui/hooks/
MSG='feat(ui): add icon set' && commit src/shared/ui/icons/
MSG='feat(ui): add navigation components' && commit src/shared/ui/nav/
MSG='feat(ui): add logo and wordmark components' && commit src/shared/ui/logo.tsx src/shared/ui/logo-mark.tsx src/shared/ui/wordmark.tsx src/shared/ui/composite-logo.tsx src/shared/ui/link-logo.tsx src/shared/ui/nav-wordmark.tsx
MSG='feat(ui): add table primitives' && commit src/shared/ui/table/
MSG='feat(ui): add chart components' && commit src/shared/ui/charts/
MSG='feat(ui): add carousel components' && commit src/shared/ui/carousel/
MSG='feat(ui): add combobox components' && commit src/shared/ui/combobox/
MSG='feat(ui): add date picker components' && commit src/shared/ui/date-picker/
MSG='feat(ui): add filter components' && commit src/shared/ui/filter/
MSG='feat(ui): add card list components' && commit src/shared/ui/card-list/
MSG='feat(ui): add rich text area components' && commit src/shared/ui/rich-text-area/

# Split remaining root UI files into batches
mapfile -t UI_FILES < <(find src/shared/ui -maxdepth 1 -type f | sort)
batch=1
chunk=()
for file in "${UI_FILES[@]}"; do
  chunk+=("$file")
  if ((${#chunk[@]} >= 8)); then
    MSG="feat(ui): add shared primitives batch ${batch}" && commit "${chunk[@]}"
    chunk=()
    batch=$((batch + 1))
  fi
done
if ((${#chunk[@]} > 0)); then
  MSG="feat(ui): add shared primitives batch ${batch}" && commit "${chunk[@]}"
fi

echo "Done. Commit count since initial:"
git rev-list --count b07b657..HEAD
