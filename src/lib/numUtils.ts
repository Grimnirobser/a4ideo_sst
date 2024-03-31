export const compactNumberFormat = (number?: number) => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });

  return formatter.format(number || 0);
};



export const safeRoundOneDecimalDivider = (numerator: number, denominator: number) => {
  if (denominator === 0) return "0.0";
  return (Math.round((numerator / denominator) * 1000) / 10).toFixed(1);

}

export const toHHMMSS = (secs: number) => {
  const secNum = parseInt(secs.toString(), 10);
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor(secNum / 60) % 60;
  const seconds = secNum % 60;

  return [hours, minutes, seconds]
    .map((val) => (val < 10 ? `0${val}` : val))
    .filter((val, index) => val !== "00" || index > 0)
    .join(":")
    .replace(/^0/, "");
};