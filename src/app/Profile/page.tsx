'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, DollarSign, Users, Activity, FileText, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics, AnalyticsData } from '@/services/analyticsService';
import { useToast } from '@/hooks/use-toast';
import { getRevenueBreakdown } from '@/services/getRevenueBreakdown';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type RevenueBreakdownItem = {
  name: string;
  value: number;
  color: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "hospital-primary", isLoading = false }: any) => (
  <Card className="stat-card fade-in">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-hospital-text">{value}</p>
              {trend && (
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-hospital-success' : 'text-hospital-error'}`}>
                  <TrendingUp className="h-4 w-4" />
                  <span>{trendValue}</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-${color}/10`}>
          <Icon className={`h-6 w-6 text-${color}`} style={{ color: color === 'hospital-primary' ? '#2E86AB' : color }} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AnalyticsDashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdownItem[]>([]);
  const { toast } = useToast();
  
  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', selectedYear, selectedMonth],
    queryFn: () => fetchAnalytics(
      parseInt(selectedYear), 
      selectedMonth === 'all' ? undefined : parseInt(selectedMonth) + 1
    ),
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching analytics",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const processChartData = (rawData: AnalyticsData[]) => {
    return rawData.map((item, index) => ({
      month: monthNames[index],
      revenue: item.revenue,
      patients: Math.floor(item.revenue / 2500) + Math.floor(Math.random() * 50), // Estimate patients from revenue
      admissions: item.admissions,
      doctorFees: item.doctorFees,
      operationCost: item.operationCost,
      medicineCost: item.medicineCost,
      bottleCost: item.bottleCost,
      injectionCost: item.injectionCost,
      roomCost: item.roomCost,
      otherCharges: item.otherCharges,
    }));
  };

  const getFilteredData = () => {
    if (!analyticsData?.analytics?.data) return [];
    
    const processedData = processChartData(analyticsData.analytics.data);
    
    if (selectedMonth === 'all') {
      return processedData;
    }
    
    return processedData.filter((_, index) => index === parseInt(selectedMonth));
  };

  const chartData = getFilteredData();
  const totalRevenue = analyticsData?.analytics?.totalRevenue || 0;
  const totalPatients = analyticsData?.analytics?.totalPatients || 0;
  const totalAdmissions = chartData.reduce((sum, item) => sum + item.admissions, 0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchAnalytics(parseInt(selectedYear), parseInt(selectedMonth)+1);
        if (res.success) {
          const breakdown = getRevenueBreakdown(res.analytics.data);
          setRevenueBreakdown(breakdown);
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
      }
    };

    loadData();
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Data refreshed",
      description: "Analytics data has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-hospital-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="slide-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-hospital-text">Hospital Analytics</h1>
              <p className="text-muted-foreground">Track your hospital&apos;s performance and revenue insights</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
                Refresh
              </Button>
              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[120px] hospital-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[140px] hospital-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="0">January</SelectItem>
                  <SelectItem value="1">February</SelectItem>
                  <SelectItem value="2">March</SelectItem>
                  <SelectItem value="3">April</SelectItem>
                  <SelectItem value="4">May</SelectItem>
                  <SelectItem value="5">June</SelectItem>
                  <SelectItem value="6">July</SelectItem>
                  <SelectItem value="7">August</SelectItem>
                  <SelectItem value="8">September</SelectItem>
                  <SelectItem value="9">October</SelectItem>
                  <SelectItem value="10">November</SelectItem>
                  <SelectItem value="11">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            trendValue="+12.5%"
            color="#2E86AB"
            isLoading={isLoading}
          />
          <StatCard
            title="Total Patients"
            value={totalPatients.toLocaleString()}
            icon={Users}
            trend="up"
            trendValue="+8.2%"
            color="#76C7C0"
            isLoading={isLoading}
          />
          <StatCard
            title="Admissions"
            value={totalAdmissions.toLocaleString()}
            icon={Activity}
            trend="up"
            trendValue="+15.1%"
            color="#F4D35E"
            isLoading={isLoading}
          />
          <StatCard
            title="Avg. Bill Amount"
            value={`₹${totalPatients > 0 ? Math.round(totalRevenue / totalPatients).toLocaleString() : '0'}`}
            icon={FileText}
            trend="up"
            trendValue="+4.3%"
            color="#22C55E"
            isLoading={isLoading}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-hospital-primary" />
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-hospital-error mb-4">Failed to load analytics data</p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <Card className="chart-container fade-in">
                <CardHeader>
                  <CardTitle className="text-hospital-text">Monthly Revenue Trend</CardTitle>
                  <CardDescription>Revenue comparison across months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#2E86AB" fill="#2E86AB" fillOpacity={0.1} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue Breakdown Pie Chart */}
              <Card className="chart-container fade-in">
                <CardHeader>
                  <CardTitle className="text-hospital-text">Revenue Breakdown</CardTitle>
                  <CardDescription>Distribution of revenue sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        stroke="none"
                      >
                        {revenueBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {revenueBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Admissions Chart */}
              <Card className="chart-container fade-in">
                <CardHeader>
                  <CardTitle className="text-hospital-text">Patient Admissions</CardTitle>
                  <CardDescription>Monthly admission trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px'
                        }}
                      />
                      <Bar dataKey="admissions" fill="#76C7C0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cost Analysis Chart */}
              <Card className="chart-container fade-in">
                <CardHeader>
                  <CardTitle className="text-hospital-text">Cost Analysis</CardTitle>
                  <CardDescription>Breakdown of different cost categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px'
                        }}
                      />
                      <Line type="monotone" dataKey="doctorFees" stroke="#2E86AB" strokeWidth={3} dot={{ fill: '#2E86AB', r: 4 }} />
                      <Line type="monotone" dataKey="operationCost" stroke="#F4D35E" strokeWidth={3} dot={{ fill: '#F4D35E', r: 4 }} />
                      <Line type="monotone" dataKey="medicineCost" stroke="#22C55E" strokeWidth={3} dot={{ fill: '#22C55E', r: 4 }} />
                      <Line type="monotone" dataKey="roomCost" stroke="#76C7C0" strokeWidth={3} dot={{ fill: '#76C7C0', r: 4 }} />
                      <Line type="monotone" dataKey="bottleCost" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4', r: 4 }} />
                      <Line type="monotone" dataKey="injectionCost" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
                      <Line type="monotone" dataKey="otherCharges" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hospital-card fade-in">
                <CardHeader>
                  <CardTitle className="text-lg text-hospital-text">Top Performing Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-hospital-primary mb-2">
                      {chartData.length > 0 ? chartData.reduce((max, curr) => curr.revenue > max.revenue ? curr : max).month : 'N/A'}
                    </div>
                    <div className="text-xl font-semibold text-hospital-text">
                      ₹{chartData.length > 0 ? chartData.reduce((max, curr) => curr.revenue > max.revenue ? curr : max).revenue.toLocaleString() : '0'}
                    </div>
                    <Badge className="bg-hospital-aqua/10 text-hospital-aqua border-hospital-aqua/20 mt-2">
                      Highest Revenue
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hospital-card fade-in">
                <CardHeader>
                  <CardTitle className="text-lg text-hospital-text">Average Monthly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-hospital-success mb-2">+12.8%</div>
                    <div className="text-sm text-muted-foreground">Compared to last year</div>
                    <Badge className="bg-hospital-success/10 text-hospital-success border-hospital-success/20 mt-2">
                      Growing
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hospital-card fade-in">
                <CardHeader>
                  <CardTitle className="text-lg text-hospital-text">Patient Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-hospital-yellow mb-2">4.8/5</div>
                    <div className="text-sm text-muted-foreground">Average rating</div>
                    <Badge className="bg-hospital-yellow/10 text-hospital-yellow border-hospital-yellow/20 mt-2">
                      Excellent
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;