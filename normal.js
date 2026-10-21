// Abramowitz–Stegun 7.1.26 approximation, evaluated as erfc to preserve small tails.
function erfcPositive(x) {
  const t = 1 / (1 + .3275911 * x);
  return (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - .284496736) * t + .254829592) * t * Math.exp(-x * x);
}
function parameters(x, mean, sigma) {
  if (![x, mean, sigma].every(Number.isFinite) || sigma <= 0) throw new RangeError("Use finite numbers and a positive standard deviation.");
}
export function density(x, mean = 0, sigma = 1) {
  parameters(x, mean, sigma);
  return Math.exp(-.5 * ((x - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}
export function cdf(x, mean = 0, sigma = 1) {
  parameters(x, mean, sigma);
  const z = (x - mean) / (sigma * Math.SQRT2);
  const tail = .5 * erfcPositive(Math.abs(z));
  return z < 0 ? tail : 1 - tail;
}
export function survival(x, mean = 0, sigma = 1) {
  parameters(x, mean, sigma);
  const z = (x - mean) / (sigma * Math.SQRT2);
  const tail = .5 * erfcPositive(Math.abs(z));
  return z >= 0 ? tail : 1 - tail;
}
export function probability(mean, sigma, kind, lower, upper = lower) {
  parameters(lower, mean, sigma); parameters(upper, mean, sigma);
  if (kind === "below") return cdf(lower, mean, sigma);
  if (kind === "above") return survival(lower, mean, sigma);
  if (kind !== "between" || lower > upper) throw new RangeError("Choose below, above, or an ordered interval.");
  const value = lower >= mean ? survival(lower, mean, sigma) - survival(upper, mean, sigma) : cdf(upper, mean, sigma) - cdf(lower, mean, sigma);
  return Math.max(0, Math.min(1, value));
}
