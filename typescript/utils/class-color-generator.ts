export const hexColorSequence = [
  "#F87171",
  "#FACC15",
  "#34D399",
  "#38BDF8",
  "#A78BFA",
  "#DB2777",
  "#FB923C",
  "#65A30D",
  "#0D9488",
  "#2563EB",
  "#9333EA",
  "#FB7185",
  "#FBBF24",
  "#4ADE80",
  "#22D3EE",
  "#818CF8",
  "#E879F9",
  "#DC2626",
  "#CA8A04",
  "#059669",
  "#0284C7",
  "#7C3AED",
  "#F472B6",
  "#EA580C",
  "#A3E635",
  "#2DD4BF",
  "#60A5FA",
  "#C084FC",
  "#E11D48",
  "#D97706",
  "#16A34A",
  "#0891B2",
  "#4F46E5",
  "#C026D3",
];

// It's charkra's gray.200
export const noneClassColor = "#E2E8F0";

const fillColorHashMap = (colors: string[]) => {
  const hashMap = hexColorSequence.reduce<Record<string, number>>(
    (obj, key) => ({ ...obj, [key]: 0 }),
    {}
  );
  colors.forEach((color) => {
    hashMap[color] += 1;
  });

  return hashMap;
};

export const getNextClassColor = (attributedColors: string[]): string => {
  if (attributedColors.length === 0) {
    return hexColorSequence[0];
  }

  const hashMap: { [key: string]: number } = fillColorHashMap(attributedColors);

  const [nextColor] = Object.entries(hashMap).reduceRight((previous, current) =>
    previous[1] < current[1] ? previous : current
  );

  return nextColor;
};
