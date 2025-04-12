'use client';

import * as React from 'react';

import Image from 'next/image';

import {
  Minus,
  Plus,
  ChartNoAxesCombined,
  Users,
  Calendar,
  Settings,
  Code,
} from 'lucide-react';

import { SearchForm } from '@/components/ui/Admin/AdminSearchForm';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data with icons.
const data = {
  navMain: [
    {
      title: 'Analytics',
      url: '#',
      icon: <ChartNoAxesCombined />,
      isActive: false,
    },
    {
      title: 'Bookings',
      url: '/admin/bookings',
      icon: <Calendar />,
      isActive: false,
    },
    {
      title: 'Customers',
      url: '/admin/customers',
      icon: <Users />,
      isActive: false,
    },
    {
      title: 'Landing Page',
      url: '#',
      icon: <Code />,
      isActive: false,
      items: [
        {
          title: 'Customisation',
          url: '/admin/landing-page/customisation',
          isActive: false,
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: <Settings />,
      isActive: false,
      items: [
        {
          title: 'Account',
          url: '#',
          isActive: false,
        },
        {
          title: 'Billing',
          url: '/admin/settings/billing',
          isActive: false,
        },
      ],
    },
  ],
};

// Define the type for the additional prop
interface AdminSideBarExtraProps {
  setActiveTab: (tab: string) => void;
}

// Combine Sidebar's props with the extra props
type AdminSideBarProps = React.ComponentProps<typeof Sidebar> &
  AdminSideBarExtraProps;

export function AdminSideBar({ setActiveTab, ...props }: AdminSideBarProps) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  const handleItemClick = (title: string) => {
    setActiveItem(title);
    setActiveTab(title);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <Image
                  src="/dibs-logo-red.png"
                  width={24}
                  height={24}
                  alt="Logo"
                  className="size-6"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Dibs</span>
                  {/* <span className="">v1.0.0</span> */}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      onClick={() => {
                        handleItemClick(item.title);
                        setActiveTab(item.title);
                      }}
                      className={activeItem === item.title ? 'bg-gray-200' : ''}
                    >
                      {item.icon}
                      {item.title}{' '}
                      {item.items?.length ? (
                        <>
                          <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                          <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                        </>
                      ) : null}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              onClick={() => {
                                handleItemClick(subItem.title);
                                setActiveTab(subItem.title);
                              }}
                              className={
                                activeItem === subItem.title
                                  ? 'bg-gray-200'
                                  : ''
                              }
                              style={{ cursor: 'pointer' }}
                            >
                              <div>{subItem.title}</div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
