'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TooltipProvider} from '@/components/ui/tooltip';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Dashboard Overview",
      description: "Real-time monitoring of hospital operations with comprehensive analytics",
      details: "Get instant insights into patient flow, staff schedules, room availability, and key performance indicators. Our intelligent dashboard provides a bird's-eye view of your entire hospital operation.",
      icon: "🏥",
      stats: "500+ Active Patients"
    },
    {
      title: "Patient Management",
      description: "Complete patient lifecycle management from admission to discharge",
      details: "Streamline patient registration, track medical history, manage treatments, and maintain comprehensive records. Full CRUD operations ensure data integrity and accessibility.",
      icon: "👥",
      stats: "1000+ Patients Managed"
    },
    {
      title: "Smart Appointments",
      description: "Intelligent scheduling system with 30-day advance booking",
      details: "Schedule, reschedule, or cancel appointments with ease. Our system prevents double bookings and optimizes doctor schedules for maximum efficiency.",
      icon: "📅",
      stats: "200+ Daily Appointments"
    },
    {
      title: "Medical History",
      description: "Comprehensive patient history with search and analytics",
      details: "Access complete patient medical records, treatment history, and generate detailed reports. Advanced search functionality helps locate patient information instantly.",
      icon: "📋",
      stats: "5+ Years History"
    },
    {
      title: "Billing System",
      description: "Automated billing with detailed invoicing capabilities",
      details: "Generate accurate bills, track payments, and manage insurance claims. Integrated with patient records for seamless financial management.",
      icon: "💰",
      stats: "₹10L+ Processed"
    },
    {
      title: "Advanced Analytics",
      description: "Data-driven insights for better hospital management",
      details: "Track occupancy rates, patient satisfaction, treatment outcomes, and operational efficiency. Make informed decisions with comprehensive analytics.",
      icon: "📊",
      stats: "Real-time Insights"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      hospital: "City General Hospital",
      quote: "This system has revolutionized our patient management. The intuitive interface and comprehensive features have improved our efficiency by 40%.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Hospital Administrator",
      hospital: "Metro Health Center",
      quote: "The appointment scheduling feature alone has reduced our no-shows by 30%. Highly recommended for any modern healthcare facility.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Department Head",
      hospital: "Regional Medical Center",
      quote: "Patient history tracking and billing integration have streamlined our operations significantly. Excellent support team too!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FF] via-white to-[#E6F3FF]">
      <TooltipProvider>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 md:px-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E86AB]/5 to-[#76C7C0]/5"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <Badge className="mb-6 bg-[#76C7C0]/20 text-[#2E86AB] border-[#76C7C0] shadow-[0_0_20px_rgba(46,134,171,0.3)] animate-glow">
                Next-Generation Healthcare Management
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-[#1C1F26] mb-6 leading-tight">
                Transform Your{' '}
                <span className="text-[#2E86AB] bg-gradient-to-r from-[#2E86AB] to-[#76C7C0] bg-clip-text text-transparent">
                  Hospital Operations
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                Streamline patient care, optimize workflows, and enhance operational efficiency with our comprehensive 
                Hospital Management System designed specifically for modern healthcare professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-[#2E86AB] hover:bg-[#2574A1] text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(46,134,171,0.5)]">
                      Start Free Trial
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md border-[#2E86AB]/20">
                    <DialogHeader>
                      <DialogTitle className="text-[#1C1F26]">Request Demo Access</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Get instant access to our Hospital Management System
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-[#1C1F26]">Full Name</Label>
                        <Input id="name" placeholder="Dr. John Smith" className="border-[#2E86AB]/20 focus:border-[#2E86AB]" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[#1C1F26]">Email</Label>
                        <Input id="email" type="email" placeholder="doctor@hospital.com" className="border-[#2E86AB]/20 focus:border-[#2E86AB]" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="hospital" className="text-[#1C1F26]">Hospital Name</Label>
                        <Input id="hospital" placeholder="City General Hospital" className="border-[#2E86AB]/20 focus:border-[#2E86AB]" />
                      </div>
                    </div>
                    <Button className="w-full bg-[#2E86AB] hover:bg-[#2574A1]">
                      Request Demo
                    </Button>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="lg" className="border-[#2E86AB] text-[#2E86AB] hover:bg-[#2E86AB] hover:text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 md:px-6 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Active Patients", icon: "👥" },
                { number: "50+", label: "Healthcare Providers", icon: "👨‍⚕️" },
                { number: "99.9%", label: "System Uptime", icon: "⚡" },
                { number: "24/7", label: "Support Available", icon: "🔧" }
              ].map((stat, index) => (
                <Card key={index} className="text-center border-[#2E86AB]/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(46,134,171,0.5)]">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-[#2E86AB] mb-1">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1C1F26] mb-6">
                Comprehensive Healthcare Solutions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to manage your hospital operations efficiently and provide exceptional patient care
              </p>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-12 bg-white/50 backdrop-blur-sm rounded-2xl p-2 border-[#2E86AB]/10">
                <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-[#2E86AB] data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="patients" className="rounded-xl data-[state=active]:bg-[#2E86AB] data-[state=active]:text-white">Patients</TabsTrigger>
                <TabsTrigger value="appointments" className="rounded-xl data-[state=active]:bg-[#2E86AB] data-[state=active]:text-white">Appointments</TabsTrigger>
                <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-[#2E86AB] data-[state=active]:text-white">History</TabsTrigger>
                <TabsTrigger value="billing" className="rounded-xl data-[state=active]:bg-[#2E86AB] data-[state=active]:text-white">Billing</TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-[#2E86AB] data-[state=active]:text-white">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-[#2E86AB]/10 bg-white/80 backdrop-blur-sm animate-slide-up hover:shadow-[0_0_30px_rgba(46,134,171,0.5)]" style={{ animationDelay: `${index * 100}ms` }}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-4xl">{feature.icon}</div>
                          <Badge variant="secondary" className="bg-[#76C7C0]/20 text-[#2E86AB] border-[#76C7C0]/30">
                            {feature.stats}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-semibold text-[#1C1F26]">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {feature.details}
                        </p>
                        <Button variant="outline" size="sm" className="w-full border-[#2E86AB] text-[#2E86AB] hover:bg-[#2E86AB] hover:text-white rounded-xl transition-all duration-300">
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="patients" className="space-y-8">
                <Card className="border-[#2E86AB]/10 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-[#1C1F26] flex items-center gap-3">
                      👥 Patient Management System
                    </CardTitle>
                    <CardDescription>
                      Complete patient lifecycle management with advanced features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-[#1C1F26]">Key Features:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">✅ Real-time patient registration</li>
                          <li className="flex items-center gap-2">✅ Complete medical records</li>
                          <li className="flex items-center gap-2">✅ Treatment tracking</li>
                          <li className="flex items-center gap-2">✅ Admission & discharge management</li>
                          <li className="flex items-center gap-2">✅ Emergency contact management</li>
                        </ul>
                      </div>
                      <div className="bg-[#F5F9FF] rounded-2xl p-4 border border-[#2E86AB]/10">
                        <h5 className="font-semibold mb-3 text-[#1C1F26]">Patient Statistics</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Active Patients</span>
                            <span className="font-semibold text-[#2E86AB]">342</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Admitted Today</span>
                            <span className="font-semibold text-[#76C7C0]">23</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Discharged Today</span>
                            <span className="font-semibold text-[#F4D35E]">18</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-8">
                <Card className="border-[#2E86AB]/10 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-[#1C1F26] flex items-center gap-3">
                      📅 Smart Appointment Scheduling
                    </CardTitle>
                    <CardDescription>
                      Advanced scheduling system with 30-day booking window
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-[#1C1F26]">Scheduling Features:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">📅 30-day advance booking</li>
                          <li className="flex items-center gap-2">🔄 Easy rescheduling</li>
                          <li className="flex items-center gap-2">❌ Cancellation management</li>
                          <li className="flex items-center gap-2">🚫 Double booking prevention</li>
                          <li className="flex items-center gap-2">⏰ Automated reminders</li>
                        </ul>
                      </div>
                      <div className="bg-[#F5F9FF] rounded-2xl p-4 border border-[#2E86AB]/10">
                        <h5 className="font-semibold mb-3 text-[#1C1F26]">Today&apos;s Schedule</h5>
                        <ScrollArea className="h-32">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-[#2E86AB]/10 pb-1">
                              <span>09:00 AM</span>
                              <span className="text-[#2E86AB]">Dr. Smith</span>
                            </div>
                            <div className="flex justify-between border-b border-[#2E86AB]/10 pb-1">
                              <span>10:30 AM</span>
                              <span className="text-[#2E86AB]">Dr. Johnson</span>
                            </div>
                            <div className="flex justify-between border-b border-[#2E86AB]/10 pb-1">
                              <span>02:00 PM</span>
                              <span className="text-[#2E86AB]">Dr. Wilson</span>
                            </div>
                          </div>
                        </ScrollArea>
                      </div>
                      <div className="bg-[#76C7C0]/10 rounded-2xl p-4 border border-[#76C7C0]/20">
                        <h5 className="font-semibold mb-3 text-[#1C1F26]">Quick Stats</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Today&apos;s Appointments</span>
                            <span className="font-semibold text-[#2E86AB]">47</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Completed</span>
                            <span className="font-semibold text-[#76C7C0]">32</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Remaining</span>
                            <span className="font-semibold text-[#F4D35E]">15</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-8">
                <Card className="border-[#2E86AB]/10 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-[#1C1F26] flex items-center gap-3">
                      📋 Comprehensive Medical History
                    </CardTitle>
                    <CardDescription>
                      Complete patient history with advanced search and analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-[#1C1F26]">History Management:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">🔍 Advanced search by patient ID/name</li>
                          <li className="flex items-center gap-2">📅 Date-based filtering</li>
                          <li className="flex items-center gap-2">🏥 Admission history tracking</li>
                          <li className="flex items-center gap-2">💊 Treatment history</li>
                          <li className="flex items-center gap-2">📄 Downloadable reports</li>
                          <li className="flex items-center gap-2">💰 Integrated billing generation</li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-[#F5F9FF] rounded-2xl p-4 border border-[#2E86AB]/10">
                          <h5 className="font-semibold mb-3 text-[#1C1F26]">Recent Activities</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span>Patient #P001 - John Doe</span>
                              <Badge className="bg-[#76C7C0]/20 text-[#2E86AB] border-[#76C7C0]/30">Discharged</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Patient #P002 - Jane Smith</span>
                              <Badge className="bg-[#F4D35E]/20 text-[#1C1F26] border-[#F4D35E]/30">Admitted</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Patient #P003 - Bob Wilson</span>
                              <Badge className="bg-[#2E86AB]/20 text-[#2E86AB] border-[#2E86AB]/30">Treatment</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-8">
                <Card className="border-[#2E86AB]/10 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-[#1C1F26] flex items-center gap-3">
                      💰 Automated Billing System
                    </CardTitle>
                    <CardDescription>
                      Comprehensive billing with detailed invoicing capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-[#1C1F26]">Billing Features:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">💳 Automated bill generation</li>
                          <li className="flex items-center gap-2">🏥 Treatment cost tracking</li>
                          <li className="flex items-center gap-2">🏢 Insurance integration</li>
                          <li className="flex items-center gap-2">📊 Payment tracking</li>
                          <li className="flex items-center gap-2">📧 Digital invoicing</li>
                        </ul>
                      </div>
                      <div className="bg-[#F5F9FF] rounded-2xl p-4 border border-[#2E86AB]/10">
                        <h5 className="font-semibold mb-3 text-[#1C1F26]">Revenue Overview</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Today&apos;s Revenue</span>
                            <span className="font-semibold text-[#2E86AB]">₹2,45,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Total</span>
                            <span className="font-semibold text-[#76C7C0]">₹78,50,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pending Payments</span>
                            <span className="font-semibold text-[#F4D35E]">₹12,30,000</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#76C7C0]/10 rounded-2xl p-4 border border-[#76C7C0]/20">
                        <h5 className="font-semibold mb-3 text-[#1C1F26]">Payment Methods</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Cash</span>
                            <span className="font-semibold">45%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Card</span>
                            <span className="font-semibold">30%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Insurance</span>
                            <span className="font-semibold">25%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-8">
                <Card className="border-[#2E86AB]/10 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-[#1C1F26] flex items-center gap-3">
                      📊 Advanced Analytics & Insights
                    </CardTitle>
                    <CardDescription>
                      Data-driven insights for better hospital management decisions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-[#2E86AB]/10 to-[#2E86AB]/5 rounded-2xl p-4 border border-[#2E86AB]/10">
                        <h5 className="font-semibold mb-2 text-[#1C1F26]">Occupancy Rate</h5>
                        <div className="text-2xl font-bold text-[#2E86AB]">87%</div>
                        <div className="text-sm text-muted-foreground">+5% from last month</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#76C7C0]/10 to-[#76C7C0]/5 rounded-2xl p-4 border border-[#76C7C0]/20">
                        <h5 className="font-semibold mb-2 text-[#1C1F26]">Patient Satisfaction</h5>
                        <div className="text-2xl font-bold text-[#76C7C0]">4.8/5</div>
                        <div className="text-sm text-muted-foreground">Based on 500+ reviews</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#F4D35E]/10 to-[#F4D35E]/5 rounded-2xl p-4 border border-[#F4D35E]/20">
                        <h5 className="font-semibold mb-2 text-[#1C1F26]">Avg. Treatment Time</h5>
                        <div className="text-2xl font-bold text-[#1C1F26]">3.2 days</div>
                        <div className="text-sm text-muted-foreground">-0.5 days improvement</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-4 border border-green-500/20">
                        <h5 className="font-semibold mb-2 text-[#1C1F26]">Success Rate</h5>
                        <div className="text-2xl font-bold text-green-600">96.5%</div>
                        <div className="text-sm text-muted-foreground">Treatment success rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-[#F5F9FF] to-[#E6F3FF]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1C1F26] mb-6">
                Trusted by Healthcare Professionals
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See what doctors and administrators are saying about our Hospital Management System
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-[#2E86AB]/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm animate-slide-up hover:shadow-[0_0_30px_rgba(46,134,171,0.5)]" style={{ animationDelay: `${index * 200}ms` }}>
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-[#F4D35E] text-xl">⭐</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="border-t border-[#2E86AB]/10 pt-4">
                      <div className="font-semibold text-[#1C1F26]">{testimonial.name}</div>
                      <div className="text-sm text-[#2E86AB]">{testimonial.role}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.hospital}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-[#2E86AB] to-[#76C7C0] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Hospital?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of healthcare professionals who trust our system to manage their operations efficiently
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-[#2E86AB] hover:bg-[#F5F9FF] px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-[#2E86AB] hover:bg-[#F5F9FF] px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 md:px-6 bg-[#1C1F26] text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Hospital Management System</h3>
                <p className="text-gray-300 text-sm">
                  Transforming healthcare operations with intelligent technology solutions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Patient Management</li>
                  <li>Appointment Scheduling</li>
                  <li>Medical History</li>
                  <li>Billing System</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Documentation</li>
                  <li>Training</li>
                  <li>24/7 Support</li>
                  <li>Community</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>support@hospitalms.com</div>
                  <div>+1 (555) 123-4567</div>
                  <div>24/7 Support Available</div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-600 pt-8 text-center text-sm text-gray-300">
              © 2024 Hospital Management System. All rights reserved.
            </div>
          </div>
        </footer>
      </TooltipProvider>
    </div>
  );
};

export default LandingPage;