'use client';

import { BookOpen, Users, Calendar, Clock } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: BookOpen,
      number: '50,000+',
      label: 'Books in Collection',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      number: '15,000+',
      label: 'Active Members',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Calendar,
      number: '100+',
      label: 'Monthly Events',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: Clock,
      number: '24/7',
      label: 'Digital Access',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className={`inline-flex p-4 rounded-full ${stat.bgColor} mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
