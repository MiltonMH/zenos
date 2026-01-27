// Shared statistics data for consistency across Home carousel and Statistics page

export const weeklyData = [
  { day: "Mån", charged: 12, v2h: 3, cost: 42 },
  { day: "Tis", charged: 8, v2h: 0, cost: 28 },
  { day: "Ons", charged: 15, v2h: 5, cost: 52 },
  { day: "Tor", charged: 0, v2h: 0, cost: 0 },
  { day: "Fre", charged: 22, v2h: 8, cost: 77 },
  { day: "Lör", charged: 18, v2h: 4, cost: 63 },
  { day: "Sön", charged: 10, v2h: 2, cost: 35 },
];

export const monthlyData = [
  { week: "V1", charged: 65, v2h: 12, cost: 228 },
  { week: "V2", charged: 82, v2h: 18, cost: 287 },
  { week: "V3", charged: 71, v2h: 15, cost: 249 },
  { week: "V4", charged: 126, v2h: 18, cost: 441 },
];

export const yearlyData = [
  { month: "Jan", charged: 344, v2h: 63, cost: 1205 },
  { month: "Feb", charged: 298, v2h: 52, cost: 1043 },
  { month: "Mar", charged: 412, v2h: 78, cost: 1442 },
  { month: "Apr", charged: 356, v2h: 65, cost: 1246 },
  { month: "Maj", charged: 289, v2h: 48, cost: 1012 },
  { month: "Jun", charged: 245, v2h: 42, cost: 858 },
  { month: "Jul", charged: 198, v2h: 35, cost: 693 },
  { month: "Aug", charged: 267, v2h: 45, cost: 935 },
  { month: "Sep", charged: 312, v2h: 58, cost: 1092 },
  { month: "Okt", charged: 378, v2h: 68, cost: 1323 },
  { month: "Nov", charged: 402, v2h: 72, cost: 1407 },
  { month: "Dec", charged: 356, v2h: 64, cost: 1246 },
];

// Today's data (single day)
export const dailyData = [
  { hour: "06", charged: 8, v2h: 0, cost: 16 },
  { hour: "12", charged: 0, v2h: 4, cost: 0 },
  { hour: "18", charged: 12, v2h: 0, cost: 24 },
];

// Charging history
export const chargingHistory = [
  {
    id: 1,
    date: "Idag",
    time: "06:30 - 08:15",
    energy: 24.5,
    cost: 48.50,
    type: "charging" as const,
    priceAvg: 1.98,
  },
  {
    id: 2,
    date: "Idag",
    time: "14:00 - 15:30",
    energy: 8.2,
    cost: 0,
    type: "v2h" as const,
    priceAvg: 2.85,
  },
  {
    id: 3,
    date: "Igår",
    time: "22:00 - 06:00",
    energy: 42.0,
    cost: 67.20,
    type: "charging" as const,
    priceAvg: 1.60,
  },
  {
    id: 4,
    date: "Igår",
    time: "17:00 - 19:00",
    energy: 12.5,
    cost: 0,
    type: "v2h" as const,
    priceAvg: 3.20,
  },
  {
    id: 5,
    date: "25 jan",
    time: "23:00 - 05:00",
    energy: 35.0,
    cost: 52.50,
    type: "charging" as const,
    priceAvg: 1.50,
  },
];

// Helper to get statistics for a period
export type Period = "D" | "V" | "M" | "Å";

export function getStatsForPeriod(period: Period) {
  let data;
  switch (period) {
    case "D":
      data = dailyData;
      break;
    case "V":
      data = weeklyData;
      break;
    case "M":
      data = monthlyData;
      break;
    case "Å":
      data = yearlyData;
      break;
  }

  const totalCharged = data.reduce((sum, d) => sum + d.charged, 0);
  const totalV2H = data.reduce((sum, d) => sum + d.v2h, 0);
  const totalCost = data.reduce((sum, d) => sum + d.cost, 0);

  return {
    charged: totalCharged,
    v2h: totalV2H,
    cost: totalCost,
  };
}
