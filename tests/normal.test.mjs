import test from "node:test";
import assert from "node:assert/strict";
import { cdf, density, probability, survival } from "../normal.js";
const close = (actual, expected) => assert(Math.abs(actual - expected) < 2e-7, `${actual} != ${expected}`);
test("standard normal centre and one-sigma interval match known values", () => {
  close(cdf(0), .5); close(density(0), 1 / Math.sqrt(2 * Math.PI)); close(probability(0, 1, "between", -1, 1), .6826894921370859);
});
test("study examples use the correct tail and stated standard deviation", () => {
  close(probability(95, 25, "below", 120), .8413447460685429);
  close(probability(95, 25, "below", 100), .579259709439103);
  close(probability(135, 30, "below", 180), .9331927987311419);
  close(probability(95, 25, "between", 75, 115), .5762892028332066);
});
test("upper tails are computed directly and remain positive", () => {
  assert(survival(8) > 0); close(cdf(2) + survival(2), 1);
  assert(probability(0, 1, "between", 7, 8) > 0);
});
test("invalid and reversed inputs are rejected", () => {
  for (const sigma of [0, -1, NaN, Infinity]) assert.throws(() => cdf(0, 0, sigma));
  assert.throws(() => probability(0, 1, "between", 2, 1)); assert.throws(() => probability(0, 1, "invalid", 1));
});
test("CDF is monotonic and integrates the symmetric density", () => {
  let previous = 0, area = 0;
  for (let x = -8; x <= 8; x += .001) { const next = cdf(x); assert(next >= previous); previous = next; area += density(x) * .001; }
  assert(Math.abs(area - 1) < 1e-5);
});
