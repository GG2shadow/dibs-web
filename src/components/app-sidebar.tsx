'use client';

import * as React from 'react';

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  ChartNoAxesCombined,
  Command,
  Frame,
  GalleryVerticalEnd,
  House,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  StampIcon,
  TvMinimal,
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
  SidebarHeader,
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
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavGeneral projects={data.navGeneral} />
        <NavTransactions items={data.navTransactions} />
        <NavVirtualLounge items={data.navVirtualLounge} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
