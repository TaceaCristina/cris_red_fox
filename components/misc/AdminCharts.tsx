'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PaymentMethod, LessonType } from "@prisma/client";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface AdminChartsProps {
  bookings: any[];
  timeSlots: any[];
}

export function AdminCharts({ bookings, timeSlots }: AdminChartsProps) {
  // Calculate payment method statistics
  const paymentMethodStats = bookings.reduce((acc, booking) => {
    acc[booking.paymentMethod] = (acc[booking.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<PaymentMethod, number>);

  const paymentMethodData = Object.entries(paymentMethodStats).map(([name, value]) => ({
    name: name === 'CARD' ? 'Card' : 'Ramburs',
    value
  }));

  // Calculate lesson type statistics
  const lessonTypeStats = bookings.reduce((acc, booking) => {
    acc[booking.type] = (acc[booking.type] || 0) + 1;
    return acc;
  }, {} as Record<LessonType, number>);

  const lessonTypeData = Object.entries(lessonTypeStats).map(([name, value]) => ({
    name: name === 'DRIVING' ? 'CONDUS' : 'ÎNVĂȚARE',
    value
  }));

  // Calculate occupancy rate
  const totalTimeSlots = timeSlots.reduce((acc, slot) => acc + slot.times.length, 0);
  const bookedTimeSlots = bookings.reduce((acc, booking) => acc + booking.times.length, 0);
  const occupancyRate = (bookedTimeSlots / totalTimeSlots) * 100;

  const occupancyData = [
    { name: 'Ocupate', value: bookedTimeSlots },
    { name: 'Disponibile', value: totalTimeSlots - bookedTimeSlots }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Metoda de plată preferată</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipul de ședințe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lessonTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {lessonTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gradul de ocupare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 