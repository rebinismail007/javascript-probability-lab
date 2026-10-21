import { cdf, density, probability } from "./normal.js";
const form = document.querySelector("form"), result = document.querySelector("#result"), formula = document.querySelector("#formula"), status = document.querySelector("#status");
const input = name => form.elements.namedItem(name);
const values = () => ({ mean: input("mean").valueAsNumber, sigma: input("sigma").valueAsNumber, kind: input("kind").value, lower: input("lower").valueAsNumber, upper: input("upper").valueAsNumber });
const presets = {
  exam: { mean: 95, sigma: 25, kind: "below", lower: 120, upper: 150 },
  canteen: { mean: 135, sigma: 30, kind: "below", lower: 180, upper: 200 },
  flowers: { mean: 22, sigma: 6, kind: "between", lower: 15, upper: 25 }
};
function update() {
  const { mean, sigma, kind, lower, upper } = values();
  input("upper").disabled = kind !== "between";
  try {
    if (Math.abs(mean) > 1e9 || sigma < .000001 || sigma > 1e9) throw new RangeError("Use a mean within ±1 billion and a standard deviation from 0.000001 to 1 billion.");
    const area = probability(mean, sigma, kind, lower, upper);
    result.textContent = `${(area * 100).toFixed(2)}%`;
    formula.textContent = kind === "between" ? `P(${lower} ≤ X ≤ ${upper})` : `P(X ${kind === "below" ? "≤" : ">"} ${lower})`;
    status.textContent = "A continuous distribution: the probability of one exact value is zero.";
    const start = mean - 4 * sigma, end = mean + 4 * sigma;
    const points = Array.from({ length: 241 }, (_, i) => {
      const value = start + (end - start) * i / 240;
      return { value, x: 35 + 630 * i / 240, y: 225 - density(value, mean, sigma) / density(mean, mean, sigma) * 170 };
    });
    document.querySelector("#curve").setAttribute("d", points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" "));
    const selected = points.filter(p => kind === "below" ? p.value <= lower : kind === "above" ? p.value >= lower : p.value >= lower && p.value <= upper);
    document.querySelector("#shade").setAttribute("d", selected.length ? `M${selected[0].x},225 ` + selected.map(p => `L${p.x},${p.y}`).join(" ") + ` L${selected.at(-1).x},225 Z` : "");
    for (let i = 0; i <= 4; i++) document.querySelector(`#tick-${i}`).textContent = (mean + (i * 2 - 4) * sigma).toLocaleString("en", { maximumFractionDigits: 2 });
  } catch (error) { result.textContent = "—"; formula.textContent = "Check the inputs"; status.textContent = error.message; document.querySelector("#shade").setAttribute("d", ""); }
}
form.addEventListener("input", update);
form.addEventListener("submit", event => event.preventDefault());
for (const button of document.querySelectorAll("[data-preset]")) button.addEventListener("click", () => {
  for (const [name, value] of Object.entries(presets[button.dataset.preset])) input(name).value = value;
  update();
});
document.querySelector("#export").addEventListener("click", () => {
  const { mean, sigma } = values();
  try {
    if (!Number.isFinite(mean) || !Number.isFinite(sigma) || sigma <= 0) throw new Error("Enter valid parameters before exporting.");
    const rows = ["x,density,p_below"];
    for (let i = 0; i <= 100; i++) { const x = mean + (i / 100 * 8 - 4) * sigma; rows.push([x, density(x, mean, sigma), cdf(x, mean, sigma)].join(",")); }
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const link = document.createElement("a"); link.href = url; link.download = "normal-distribution.csv"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) { status.textContent = error.message; }
});
update();
