# AGENTS.md — Website Project Rules

## 1. Visual Design — must NOT look AI-generated
Before writing any UI/CSS, define a design token system first (don't skip this step):
- **Colors**: pick 4–6 named hex values that fit this site's actual subject and audience — not a generic template palette
- **Type**: at least 2 typefaces — one characterful display face (used with restraint) + one complementary body face
- **Layout**: sketch the layout concept and pick ONE signature/memorable element the page will be remembered for

Explicitly avoid these overused "AI-generated" defaults:
- Warm cream background (~#F4F1EA) + high-contrast serif + terracotta/clay accent (~#D97757)
- Near-black background with a single bright acid-green or vermilion accent
- Broadsheet layout: hairline rules, zero border-radius, dense newspaper-style columns

Other rules:
- Spend boldness in ONE place (the signature element); keep everything else disciplined and quiet
- Responsive down to mobile, visible keyboard focus states, respect `prefers-reduced-motion`
- Don't add animation/motion just for the sake of it — restraint usually reads as more intentional than more motion does

## 2. Bug Coverage & Error Handling
- Think through edge cases explicitly, not just the happy path (empty states, slow/failed network, invalid input, empty data)
- Wrap async/network calls in proper error handling — never fail silently
- Validate all user input before using it
- Zero console errors or warnings before marking any task complete
- After every change: run it and verify it actually works — don't assume

## 3. Lighthouse Score — keep all 4 categories at 90+
- **Performance**: optimize/compress images, lazy-load below-the-fold content, avoid render-blocking CSS/JS, minimize unused code
- **Accessibility**: semantic HTML, correct heading hierarchy, sufficient color contrast, alt text on all images, ARIA labels only where semantic HTML isn't enough
- **Best Practices**: no console errors, no deprecated APIs, HTTPS-ready
- **SEO**: title + meta description on every page, semantic structure, valid HTML
- Re-run Lighthouse after significant changes — don't wait until the very end to check

## 4. Workflow
- For anything non-trivial: plan and break the task down before writing code
- Verify before calling anything "done": run it, check the diff, confirm zero errors
