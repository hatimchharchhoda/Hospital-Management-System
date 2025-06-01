export interface AnalyticsData {
  month: number;
  revenue: number;
  admissions: number;
  doctorFees: number;
  operationCost: number;
  medicineCost: number;
  roomCost: number;
  bottleCost: number;
  injectionCost: number;
  otherCharges: number;
}

export interface AnalyticsResponse {
  success: boolean;
  analytics: {
    totalRevenue: number;
    totalPatients: number;
    data: AnalyticsData[];
  };
  message?: string;
}

export const fetchAnalytics = async (year: number, month?: number): Promise<AnalyticsResponse> => {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, month }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};