# Motion Lab demo

The homepage navigation links to `/motion-lab/`. This static Astro page uses the shared site layout so the site-wide GTM integration also applies after the GTM branch is merged. There is no upload, analysis API, account, database, or paid dependency.

## Source data

The bundled outputs are the existing RELOOVA Motion Lab sample analyzed on 2026-10-25 with Sports2D 0.8.34 / RTMLib 0.0.16: 491 frames, 16.3667 seconds, 2 completed repetitions. Angles are 2D estimates, with absolute accuracy unvalidated. Original input SHA-256: `4a206efe73ba6f83820511889066edd69593d243eb20058498e9c8fe157592bc`.

The processed video comes from RDNE Stock project / Pexels, “A Woman Doing Squats”, https://www.pexels.com/video/a-woman-doing-squats-8402111/ (Pexels License https://www.pexels.com/license/). The page includes attribution and does not imply endorsement. Only the processed overlay is bundled, not the original footage. The existing PoC source is https://github.com/heart-cxxvii/reloova-motion-poc .

## Integration

Work is isolated in `codex/motion-lab-demo`, based on production main `f05f78a`. Keep this PR in draft until `codex/gtm-ga4-setup` is integrated. Refresh from main then preserve the GTM component, head/body placements, and tracking configuration. The BaseLayout change only adds optional title/description props; the demo reuses BaseLayout rather than copying tracking markup.

## Verification

Run `npm ci`, `npm run check`, and `npm run build`. Browser checks cover Home → Demo → Home, loaded data and 2 repetitions, metric selection, video seeking with chart cursor synchronization, CSV download, and mobile navigation with no horizontal overflow. All assets use same-origin `/motion-lab/` paths. No analysis is executed when visitors open the page.
