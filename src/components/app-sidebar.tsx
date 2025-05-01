'use client';

import * as React from 'react';

import {
  AudioWaveform,
  Calendar,
  ChartNoAxesCombined,
  Command,
  GalleryVerticalEnd,
  House,
  StampIcon,
  TvMinimalPlay,
  UsersIcon,
} from 'lucide-react';

import { NavGeneral } from './nav-general';
import { NavTransactions } from './nav-transactions';
import { NavVirtualLounge } from './nav-VirtualLounge';
import { TeamSwitcher } from './team-switcher';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'Frites',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Jurong Branch',
      logo: GalleryVerticalEnd,
      address: 'Jurong East Street 82 #01-02 Singapore 609603',
    },
    {
      name: 'Woodlands Branch',
      logo: AudioWaveform,
      address: 'Woodlands Street 123 #02-13 Singapore 730123',
    },
    {
      name: 'Changi Branch',
      logo: Command,
      address: 'Changi Street 456 #05-02 Singapore 456789',
    },
  ],
  navGeneral: [
    {
      name: 'Analytics',
      url: '#',
      icon: ChartNoAxesCombined,
    },
    {
      name: 'Customers',
      url: '#',
      icon: UsersIcon,
    },
  ],
  navTransactions: [
    {
      title: 'Transactions',
      url: '#',
      icon: StampIcon,
      items: [
        {
          title: 'Stamps',
          url: '#',
        },
        {
          title: 'Bookings',
          url: '#',
        },
      ],
    },
  ],
  navVirtualLounge: [
    {
      title: 'Virtual Lounge',
      url: '#',
      icon: House,
      items: [
        {
          title: 'Customise',
          url: '#',
        },
      ],
    },
  ],
  navMain: [
    {
      title: 'Stamps',
      url: '#',
      icon: StampIcon,
      items: [
        {
          title: 'Actions',
          url: '#',
        },
      ],
    },
    {
      title: 'Bookings',
      url: '#',
      icon: Calendar,
      items: [
        {
          title: 'Schedules',
          url: '#',
        },
      ],
    },
    {
      title: 'Marketing',
      url: '#',
      icon: TvMinimalPlay,
      items: [
        {
          title: 'Nothing here yet...',
          url: '#',
        },
      ],
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img
                  src="/dibs-logo-red.png"
                  alt="logo"
                  className="w-6 transition-all duration-300"
                />
                <h1 className="text-dibs-red font-dm-sans text-xl font-bold">
                  Dibs
                </h1>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <NavGeneral
            projects={data.navGeneral}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavTransactions
            items={data.navTransactions}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavVirtualLounge
            items={data.navVirtualLounge}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </SidebarGroup>
        <NavMain
          items={data.navMain}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={data.user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
