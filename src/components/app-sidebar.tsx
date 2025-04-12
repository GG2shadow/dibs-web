'use client';

import * as React from 'react';

import Image from 'next/image';

import {
  ChartNoAxesCombined,
  Stamp,
  HelpCircleIcon,
  ScrollText,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  Construction,
} from 'lucide-react';

import { NavMarketing } from './ui/nav-marketing';

import { NavBookings } from '@/components/nav-bookings';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavStamps } from '@/components/nav-stamps';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'Frites',
    email: 'm@frites.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Analytics',
      url: '#',
      icon: ChartNoAxesCombined,
    },
    {
      title: 'Customers',
      url: '#',
      icon: UsersIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: SettingsIcon,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: HelpCircleIcon,
    },
    {
      title: 'Search',
      url: '#',
      icon: SearchIcon,
    },
  ],
  stamps: [
    {
      name: 'Actions',
      url: '#',
      icon: Stamp,
      parentName: 'Stamps',
    },
    {
      name: 'Transactions',
      url: '#',
      icon: ScrollText,
      parentName: 'Stamps',
    },
  ],
  bookings: [
    {
      name: 'Transactions',
      url: '#',
      icon: ScrollText,
      parentName: 'Bookings',
    },
  ],
  marketing: [
    {
      name: 'Coming soon...',
      url: '#',
      icon: Construction,
      parentName: 'Marketing',
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({
  activeTab,
  setActiveTab,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image
                  src="/dibs-logo-red.png"
                  alt="logo"
                  width={24}
                  height={24}
                  className="w-6 transition-all duration-300"
                />
                <h1 className="text-primary font-dm-sans text-xl font-bold">
                  Dibs
                </h1>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <NavStamps
          items={data.stamps}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <NavBookings
          items={data.bookings}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <NavMarketing
          items={data.marketing}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
