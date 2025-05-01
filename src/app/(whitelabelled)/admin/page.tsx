'use client';

import { useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import AnalyticsTabContent from '@/components/ui/Admin/AnalyticsContent';
import { BookingsTransactionTabContent } from '@/components/ui/Admin/BookingsTransactionContent';
import { StampsTransactionTabContent } from '@/components/ui/Admin/StampsTransactionContent';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { VirtualLoungeCustomise } from '@/components/ui/Admin/SideBarContent/VirtualLoungeCustomise';

export default function Page() {
  const [activeTab, setActiveTab] = useState('Analytics');

  const renderContent = () => {
    switch (activeTab) {
      case 'Analytics':
        return <AnalyticsTabContent />;
      case 'Virtual Lounge Customise':
        return <VirtualLoungeCustomise />;
      case 'Transactions Stamps': // The format is "{parentName} {name}"
        return <StampsTransactionTabContent />;
      case 'Transactions Bookings': // The format is "{parentName} {name}"
        return <BookingsTransactionTabContent />;
      default:
        return <AnalyticsTabContent />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
