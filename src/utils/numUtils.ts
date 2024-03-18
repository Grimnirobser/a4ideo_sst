export const compactNumberFormat = (number?: number) => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });

  return formatter.format(number || 0);
};



export const safeRoundOneDecimalDivider = (numerator: number, denominator: number) => {
  if (denominator === 0) return "0.0";
  return (Math.round((numerator / denominator) * 1000) / 10).toFixed(1);

}