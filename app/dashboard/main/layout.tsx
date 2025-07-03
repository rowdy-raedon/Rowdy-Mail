'use client';

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { useUser } from "@stackframe/stack";
import { Globe, Mail, Settings2, Zap } from "lucide-react";

const navigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: Globe,
    type: "item",
  },
  {
    type: 'label',
    name: 'Email Services',
  },
  {
    name: "Temp Email",
    href: "/temp-email",
    icon: Mail,
    type: "item",
  },
  {
    name: (
      <div className="flex items-center justify-between w-full">
        <span>Real Emails</span>
        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
          Coming Soon
        </span>
      </div>
    ),
    href: "/real-emails",
    icon: Zap,
    type: "item",
  },
  {
    type: 'label',
    name: 'Settings',
  },
  {
    name: "Configuration",
    href: "/configuration",
    icon: Settings2,
    type: "item",
  },
];

export default function Layout(props: { children: React.ReactNode }) {
  const user = useUser();

  // Show loading state while authentication is being resolved
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show simple unauthorized message instead of redirecting
  if (user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarLayout 
      items={navigationItems}
      basePath={`/dashboard/main`}
      sidebarTop={
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-600 dark:text-blue-400">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold">{user?.displayName || user?.primaryEmail || 'User'}</h1>
            <p className="text-xs text-muted-foreground">Personal Account</p>
          </div>
        </div>
      }
      baseBreadcrumb={[{
        title: "Dashboard",
        href: `/dashboard/main`,
      }]}
    >
      {props.children}
    </SidebarLayout>
  );
}