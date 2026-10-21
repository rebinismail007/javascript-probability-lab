# Curveball — JavaScript probability playground

A normal-distribution calculator with a shaded SVG curve, editable parameters, study presets and CSV export. New reconstruction of the supplied **normalfordeling opgave** worksheet, October 2026. The PDF contains exercises and graph screenshots, not program source.

## Run

Node.js 24+; no dependencies or build step.

```sh
npm start
npm test
```

Open http://127.0.0.1:4173. Try exam time, canteen spending or flower sales; switch between below, above and interval probabilities. The graph displays μ ± 4σ; the numerical result includes the full tail. Export 101 density/CDF points as CSV.

## Reconstructing the worksheet carefully

- Exam example: μ = 95, σ = 25. `P(X ≤ 120)` is about **84.13%**; the PDF's written 16% conclusion confuses this with the upper tail.
- The interval 75–115 is ±20, not ±25; it contains about **57.63%**, rather than the 68% one-standard-deviation interval.
- The flower question states σ = 6, while some screenshots use 5. The preset follows the question's σ = 6.

`normal.js` uses the Abramowitz–Stegun 7.1.26 error-function approximation. Absolute CDF error is approximately 1e-7; tiny-tail relative accuracy is weaker. Survival probabilities are evaluated directly, avoiding cancellation from `1 - CDF` in the far upper tail. This is an educational calculator, not a high-precision statistics package.

Five tests check reference probabilities, tail direction, malformed inputs, monotonicity and numerical density integration.
