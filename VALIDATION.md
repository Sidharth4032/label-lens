# Validation record — September 25, 2026

## Automated checks

`npm test`: 11/11 passed. `node --check dist/app.mjs`: passed.

Cases cover brand normalization and substring rejection, numeric ABV equivalence/mismatch, proof-only ambiguity, net-content conversions, warning punctuation/wording/capitalization, line wraps, mandatory manual formatting review, low confidence, missing inputs, imported origin and manifest validation.

## Actual OCR measurement

Fixture: 1200 × 1500 pixels, synthetic distilled-spirit label, plain readable typography, English text, complete health warning. Runtime: Tesseract.js 6.0.1, English model, LSTM-only engine, sparse-text segmentation (PSM 11), Node on the build host. No network download was included; the model was available on disk.

| Measurement | Result |
| --- | ---: |
| Model initialization | 441 ms |
| First recognition | 1,151 ms |
| Second recognition | 975 ms |
| Reported OCR confidence | 95 |

The full brand, class/type, ABV, volume, producer/address and warning were recovered. PSM 3 initially omitted the large brand heading; PSM 11 fixed that fixture and is used by the app.

These are two measurements on one synthetic fixture, not a statistically valid performance benchmark. They do not establish browser/mobile performance, network model load time, real-artwork accuracy, a five-second p95 SLA, or 300-image throughput. Browser UI and live WebMCP testing were unavailable for the static-site execution path.

## Acceptance checks for submission

1. Open the Site in the target browser; load samples and run the queue.
2. Verify the mismatching sample flags 40% vs 45% and the title-case warning heading.
3. Try your real label images, including a low-quality photo and a missing warning.
4. Import the manifest both before and after images; verify filename pairing.
5. Export results and confirm expected values, recognized text, confidence, corrections, elapsed time and human-review findings are present.
6. Check desktop/mobile layout, keyboard navigation, first-use and repeated timing.
7. Grant reviewers Site access before submitting the link. Source is available in the managed Git repository and as a portable ZIP.
