'use client';

import { useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import AnalyticsTabContent from '@/components/ui/Admin/AnalyticsContent';
import { BookingsTransactionTabContent } from '@/components/ui/Admin/BookingsTransactionContent';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Page() {
  const [activeTab, setActiveTab] = useState('Analytics');

  const renderContent = () => {
    switch (activeTab) {
      case 'Analytics':
        return <AnalyticsTabContent />;
      case 'Bookings Transactions':
        return <BookingsTransactionTabContent />;
      default:
        return <AnalyticsTabContent />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar
        variant="inset"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
