"use client";

import "./dashboardDesign.css";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  RiSendPlaneFill,
  RiMailAddLine,
  RiSendPlaneLine,
} from "react-icons/ri";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/utils/store/user";

// ✅ Utility function — moved above so both components can use it
function getUserInitials(name) {
  if (!name) return "US";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const navItems = [
  {
    name: "Emails",
    href: "/dashboard/emails",
    icon: <RiMailAddLine className="h-5 w-5" />,
  },
  {
    name: "Outbound",
    href: "/dashboard/outbounds",
    icon: <RiSendPlaneLine className="h-5 w-5" />,
  },
];

export default function DashboardLayout({ children }) {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    clearUser();
    router.push("/login");
  }

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-50 relative">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
              <SidebarContent pathname={pathname} />
            </div>
          </div>

          {/* Mobile Sidebar */}
          {mobileOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-40 z-30"
                onClick={() => setMobileOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 w-64 bg-white z-40 shadow-lg">
                <SidebarContent
                  pathname={pathname}
                  closeSidebar={() => setMobileOpen(false)}
                />
              </div>
            </>
          )}

          {/* Mobile Bottom Nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
            <nav className="flex justify-around">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center py-2 px-3 text-xs ${
                    pathname === item.href ? "text-indigo-600" : "text-gray-500"
                  }`}
                >
                  <span className="mb-1">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top nav */}
            <header className="bg-white shadow-sm z-20">
              <div className="flex items-center justify-between p-4 sm:px-6">
                <div className="flex items-center space-x-4">
                  <button
                    className="md:hidden text-gray-500 focus:outline-none"
                    onClick={() => setMobileOpen(!mobileOpen)}
                  >
                    {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                  </button>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg font-semibold text-gray-900">
                      {navItems.find((item) => item.href === pathname)?.name ||
                        "Dashboard"}
                    </h1>
                    <span className="relative inline-flex">
                      <button className="text-gray-500 hover:text-indigo-600 focus:outline-none">
                        <span className="sr-only">Notifications</span>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </button>
                      <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                    <span className="sr-only">User menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {getUserInitials(user?.first_name)}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700 border border-red-500 hover:border-red-700 px-3 py-1 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{
            margin: "8px",
          }}
          toastOptions={{
            // Base styles for all toasts
            style: {
              borderRadius: "12px",
              background: "#1F2937",
              color: "#F9FAFB",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              padding: "16px 24px",
              fontSize: "14px",
              lineHeight: "1.5",
              maxWidth: "500px",
            },
            duration: 4000,

            // Success variant
            success: {
              duration: 5000,
              iconTheme: {
                primary: "#b266ef", // Emerald-500
                secondary: "#FFFFFF",
              },
              style: {
                background: "#b266ef", // Emerald-900
                borderLeft: "4px solid #10B981",
              },
            },

            // Error variant
            error: {
              iconTheme: {
                primary: "#EF4444", // Red-500
                secondary: "#FFFFFF",
              },
              style: {
                background: "#7F1D1D", // Red-900
                borderLeft: "4px solid #EF4444",
              },
            },

            // Loading variant
            loading: {
              style: {
                background: "#1E40AF", // Blue-800
                borderLeft: "4px solid #3B82F6", // Blue-500
              },
            },

            // Custom variant (trigger with toast.custom())
            custom: {
              style: {
                background: "#6B21A8", // Purple-900
                borderLeft: "4px solid #A855F7", // Purple-500
              },
            },
          }}
        />
      </body>
    </html>
  );
}

// ✅ Sidebar Component
function SidebarContent({ pathname, closeSidebar }) {
  const user = useUserStore((state) => state.user);

  return (
    <>
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <RiSendPlaneFill className="h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          SnipeSend
        </span>
      </div>
      <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span
                className={`mr-3 ${
                  pathname === item.href ? "text-indigo-500" : "text-gray-400"
                }`}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-medium">
              {getUserInitials(user?.first_name)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {user?.first_name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
