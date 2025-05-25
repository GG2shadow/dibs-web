'use client';

import { useState } from 'react';

import { BookingsCalendar } from '@/components/ui/Admin/Content/BookingsCalendar';
import { BookingsListings } from '@/components/ui/Admin/Content/BookingsListings';
import { BookingsSchedules } from '@/components/ui/Admin/Content/BookingsSchedules';
import { ComingSoon } from '@/components/ui/Admin/Content/ComingSoon';
import { Customers } from '@/components/ui/Admin/Content/Customers';
import { StampsActions } from '@/components/ui/Admin/Content/StampsActions';
import { TransactionsBookings } from '@/components/ui/Admin/Content/TransactionsBookings';
import { TransactionsStamps } from '@/components/ui/Admin/Content/TransactionsStamps';
import { VirtualConciergeCustomise } from '@/components/ui/Admin/Content/VirtualConciergeCustomise';
import { AppSidebar } from '@/components/ui/Admin/SideBar/AdminSideBar';
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

export default function Page() {
  const [activeTab, setActiveTab] = useState('Analytics');

  const renderContent = () => {
    switch (activeTab) {
      case 'Analytics':
        return <ComingSoon />;
      case 'Customers':
        return <Customers />;
      case 'Transactions Stamps':
        return <TransactionsStamps />;
      case 'Transactions Bookings': // The format is "{parentName} {name}"
        return <TransactionsBookings />;
      case 'Virtual Concierge Customise':
        return <VirtualConciergeCustomise />;
      case 'Stamps Actions':
        return <StampsActions />;
      case 'Bookings Listings':
        return <BookingsListings />;
      case 'Bookings Schedules':
        return <BookingsSchedules />;
      case 'Bookings Calendar':
        return <BookingsCalendar />;
      default:
        return <ComingSoon />;
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
                    {activeTab.split(' ')[0]}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {activeTab.includes(' ') && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeTab.split(' ')[1]}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
