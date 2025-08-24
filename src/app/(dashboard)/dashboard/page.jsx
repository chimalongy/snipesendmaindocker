"use client";

import { FaArrowRight, FaEnvelope, FaChartLine, FaUsers, FaClock, FaCalendarAlt } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import Link from "next/link";



export default function DashboardPage() {
   
  const stats = [
    {
      name: "Total Emails Sent",
      value: "12,345",
      icon: <FaEnvelope className="h-6 w-6 text-indigo-500" />,
      change: "+12%",
      changeType: "increase",
    },
    {
      name: "Open Rate",
      value: "42.3%",
      icon: <FaChartLine className="h-6 w-6 text-green-500" />,
      change: "+3.2%",
      changeType: "increase",
    },
    {
      name: "Click Rate",
      value: "8.7%",
      icon: <FaUsers className="h-6 w-6 text-blue-500" />,
      change: "-1.1%",
      changeType: "decrease",
    },
    {
      name: "Avg. Response Time",
      value: "2.4h",
      icon: <FaClock className="h-6 w-6 text-purple-500" />,
      change: "-0.5h",
      changeType: "decrease",
    },
  ];

  const actions = [
    {
      title: "Create Campaign",
      href: "/dashboard/campaigns/new",
      icon: <RiSendPlaneFill className="h-6 w-6 text-indigo-600" />,
      description: "Setup and send a new email campaign.",
    },
    {
      title: "Schedule Emails",
      href: "/dashboard/schedule",
      icon: <FaCalendarAlt className="h-6 w-6 text-green-600" />,
      description: "Plan future email deliveries.",
    },
    {
      title: "View Analytics",
      href: "/dashboard/analytics",
      icon: <FaChartLine className="h-6 w-6 text-blue-600" />,
      description: "See detailed campaign performance.",
    },
  ];



  return (
    <div className="min-h-screen p-6 md:p-10 space-y-10">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back, User 👋</h1>
        <p className="mt-2 text-gray-600 text-sm">Here's what’s happening with your email campaigns today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow transition"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gray-100">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
            <p
              className={`mt-4 text-sm ${
                stat.changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change} vs last week
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-gray-100 group-hover:bg-indigo-50 transition">
                {action.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium">{action.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
