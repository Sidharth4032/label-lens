# Label Lens

A standalone alcohol label review prototype. Images are read by Tesseract.js's local neural OCR model, then compared with application values using deterministic, testable rules. No API keys or cloud inference service are required. This is decision support, not an approval system or a complete TTB compliance determination.

## Run locally

Use a supported Node.js LTS release (Node 24 recommended) and Python 3 for the local static server. Cloudflare deployment does not require Python.

```sh
npm ci
npm run build
npm test
npm start
```

Open http://localhost:8080. Any HTTPS static host can serve `dist/`. `npm run build` copies the pinned OCR runtime, WASM cores and English language model to the same origin. Do not serve this app with file:// URLs.

## Try it

1. Click **Try sample labels**. These are fictional, programmatically rendered PNG fixtures, not precomputed results.
2. Click **Review queue**. Both samples run real OCR. The first should match text; the second changes 45% to 40% and uses a title-case warning heading.
3. Select a queue item to inspect artwork, application fields, comparisons, OCR confidence and elapsed time.
4. Correct an OCR error under **Recognized text & corrections** and compare again. Reports explicitly mark manual corrections and retain original OCR confidence.
5. Export the JSON report. Refreshing clears the session.

For your own images, use PNG/JPEG/WebP up to 12 MB and 24 megapixels. Include all relevant panels in one image per application. Enter expected fields manually, or import a JSON manifest (template available in the app). The application `filename` must exactly match the image filename. Values are strings; `imported` is boolean. Duplicate filenames are rejected. Uploading the manifest before or after images works. Up to 300 applications can be queued, processed sequentially, and stopped after the current item. Individual image failures do not stop the queue.

```json
[
  {
    "filename": "label.png",
    "brand": "Old Tom Distillery",
    "type": "Kentucky Straight Bourbon Whiskey",
    "abv": "45",
    "volume": "750 mL",
    "producer": "Bottled by Old Tom Distillery, Louisville, KY",
    "origin": "",
    "imported": false
  }
]
```

## Architecture and decisions

- `dist/app.mjs`: upload validation, session state, OCR worker lifecycle, sample rendering, queue, export and accessible DOM interactions.
- `dist/engine.mjs`: pure comparison functions and manifest validation.
- `dist/style.css` / `dist/index.html`: responsive review workspace with an in-memory session queue and side-by-side artwork / expected values.
- `scripts/vendor.mjs`: reproducible same-origin OCR asset preparation.
- `tests/engine.test.mjs`: meaningful regression cases for false matches, mismatches, strict warnings, unit conversion, low confidence and malformed inputs.
- `tests/benchmark.mjs`: optional real OCR measurement: `node tests/benchmark.mjs /absolute/path/to/label.png`.

A small browser application is sufficient for a stateless prototype. Framework, database, authentication service, COLA integration and LLM inference would add complexity without improving the requested comparison task. Tesseract is the AI component; the compliance decisions are explicit rules. No label text is treated as instructions or executed. User-controlled output is escaped or inserted as text.

## Matching policy

- Brand/class/producer/origin: case-insensitive, Unicode apostrophe and whitespace normalization with token boundaries; never accept a partial brand such as THROW inside THROWBACK. No broad fuzzy matching that could hide substantive differences. Missing values go to review, not pass.
- ABV: recognize labeled numeric percent forms; 45 and 45.0 match, 40 versus 45 is a mismatch. Proof alone is insufficient. If multiple differing ABVs appear, flag the ambiguity as a mismatch for the reviewer.
- Net contents: normalize liters, centiliters and milliliters; US fluid ounces convert numerically. Rounded dual-unit labels and multi-packs require visual review. Finding a matching quantity is evidence of presence, not proof that all quantities are consistent.
- Warning: preserve words and punctuation, collapse layout whitespace, require an uppercase `GOVERNMENT WARNING:` heading. Body capitalization is ignored. A missing/changed warning is a review finding because OCR may have misread it.
- OCR confidence below 85 sends otherwise matched fields to review. This is an engine confidence score, not a calibrated probability of correctness.
- Formatting is always human review: heading boldness, non-bold body, separate continuous paragraph, contrast, legibility and physical type dimensions cannot be certified from OCR text or arbitrary image pixels.
- Every result remains **Review required** or **Mismatch found**. There is no automatic approval or rejection.

## Performance and privacy

A single worker is reused across the queue. Images are capped at 2400 pixels on their longest edge for processing. OCR initialization occurs on first review and is included in the application's timing; subsequent labels reuse the warm worker. No synthetic result delay, canned OCR response, or fake performance claim is used. Processing over five seconds is explicitly reported. Recognition has a 45-second timeout with a readable failure message.

All runtime/model assets are hosted on the app's own origin. Images, application details, recognized text and results stay in page memory and are never submitted to an application server. The OCR model may be cached in IndexedDB. Exported files are user-controlled. Static hosting still has ordinary access logs, and a network connection is required to load the site/model initially; this is not a certified offline PWA.

## Validation

The 11 comparison/manifest tests passed in the development checkout; rerun them against your current repository before deployment. A real 1200 × 1500 synthetic label was run twice using the pinned Tesseract runtime in Node; see `VALIDATION.md` for measured results. This does not establish browser/mobile p95 or the required five-second SLA. Browser visual and end-to-end validation remains outstanding. A feature-detected, read-only WebMCP results tool is provided; live WebMCP validation was unavailable.

## Explicit limitations and next steps

- Prototype scope centers on the supplied distilled-spirit example and generic field comparison. Beverage-specific exceptions, class/type legal validation, appellations, mandatory wording variations, and a full regulatory ruleset are not implemented.
- One image per application; front/back files must be combined before uploading. No PDF support, perspective correction, glare recovery, multilingual OCR, or server-side queue.
- Very small warning text, curved bottles, glare, stylized typography and blurred photos may fail. Downscaling can reduce small-text accuracy. Request better artwork or verify manually.
- Queue size 300 is a supported input limit, not a load-tested throughput guarantee. Processing is sequential to bound worker memory and keep the interface responsive.
- Benchmark a representative labeled corpus on actual agency hardware and browsers. Record cold/warm p50/p95, field accuracy and false matches; do not claim a five-second SLA until these pass. Use this evidence to decide whether optimized local OCR or an approved Azure extraction endpoint is needed.
- Production needs security/privacy review, approved hosting, authentication, retention policy, audit logging, accessibility evaluation and review of applicable TTB rules. No production readiness or FedRAMP claim is made.

## Sources

TTB, Distilled Spirits Labeling: Health Warning Statement (reviewed September 25, 2026):
https://www.ttb.gov/regulated-commodities/beverage-alcohol/distilled-spirits/ds-labeling-home/ds-health-warning

TTB links to 27 CFR part 16 for the applicable warning regulations. The required warning is reproduced as regulatory text, including the comma after “machinery”.

## Deployment and source delivery

Source repository: https://github.com/Sidharth4032/label-lens

Deployment target: Cloudflare Workers with static assets. Application processing runs in the browser; no custom server handler, database, or inference API key is needed. This project uses Workers, not Cloudflare Pages.

The Cloudflare deployment has not yet been verified as serving the application. After a successful build, copy the actual production URL from the Cloudflare dashboard into the GitHub repository website field and this README. Do not submit a URL that still displays the default Hello World page.

Configure the Git-connected Worker as follows:

| Setting | Value |
| --- | --- |
| Repository | Sidharth4032/label-lens |
| Production branch | main |
| Root directory | Repository root (where package.json is located) |
| Build command | `npm ci && npm test && npm run build` |
| Deploy command | `npx wrangler deploy --assets ./dist --name label-lens` |

Enable the workers.dev address under the Worker's Domains settings, or configure a custom domain. The deploy command explicitly identifies `dist` as the static asset directory; no additional deployment configuration file is required for this command-based setup. If the repository already contains a Wrangler configuration, inspect it for conflicting settings before deploying.

The build restores OCR runtime files, WebAssembly cores and the English model into `dist/vendor`. Dependencies and generated assets need not be uploaded manually. Keep package-lock.json committed and preserve bundled third-party license notices. Python's local server is not used in production.

Wait for the Git-connected build and deployment to succeed, then open the production address in a private browser window. Complete the checks in VALIDATION.md. An enabled address or a successful earlier manual deployment does not prove the latest application build is live.

The app footer links to the GitHub repository. If that repository is private, grant evaluators access. GitHub's Code menu provides a source ZIP download; after extracting it, restore dependencies and OCR assets with `npm ci` and `npm run build`.

Commit and push later changes to the connected branch to trigger another build. A hosting build-environment initialization delay happens before application code runs; changing comparison logic will not fix that stage.
