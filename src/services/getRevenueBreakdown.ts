import { AnalyticsData } from "./analyticsService";

export const getRevenueBreakdown = (analyticsData: AnalyticsData[]) => {
  const totals = {
    doctorFees: 0,
    operationCost: 0,
    roomCost: 0,
    medicineCost: 0,
    bottleCost: 0,
    injectionCost: 0,
    otherCharges: 0,
  };

  analyticsData.forEach((month) => {
    totals.doctorFees += month.doctorFees;
    totals.operationCost += month.operationCost;
    totals.roomCost += month.roomCost;
    totals.medicineCost += month.medicineCost;
    totals.bottleCost += month.bottleCost;
    totals.injectionCost += month.injectionCost;
    totals.otherCharges += month.otherCharges;
  });

  const breakdown = [
    { name: 'Doctor Fees', value: totals.doctorFees, color: '#2E86AB' },
    { name: 'Operations', value: totals.operationCost, color: '#76C7C0' },
    { name: 'Room Charges', value: totals.roomCost, color: '#F4D35E' },
    { name: 'Medicines', value: totals.medicineCost, color: '#22C55E' },
    { name: 'Bottle Cost', value: totals.bottleCost, color: '#F59E0B' },
    { name: 'Injection Cost', value: totals.injectionCost, color: '#EF4444' },
    { name: 'Other Charges', value: totals.otherCharges, color: '#8B5CF6' },
  ];

  return breakdown;
};