'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../card';
import { Button } from '@/components/ui/button';

// Dummy customer data
const customers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com" },
  { id: 5, name: "David Brown", email: "david@example.com" },
];

// Campaign options
const campaigns = [
  { id: 1, name: "Summer Special", value: "summer" },
  { id: 2, name: "Holiday Promotion", value: "holiday" },
  { id: 3, name: "New Customer", value: "new" },
  { id: 4, name: "Loyalty Reward", value: "loyalty" },
];

export function StampsActions() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    email: '',
    instagram: '',
    tiktok: '',
    bookings: false,
    stamps: false,
  });

  // Stamps management states
  const [isInitLoading, setIsInitLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stampsToGive, setStampsToGive] = useState<number>(1);
  const [redemptionRules, setRedemptionRules] = useState<{ id?: string; name?: string }[]>([]);
  const [redemptionRule, setRedemptionRule] = useState<{ id?: string; name?: string }>();

  const campaignId = '3c95f762-6adc-43f9-9306-27c9a091880e';

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  const handleCustomerSelect = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setSearchQuery(customer.name);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitStamp = async (e: React.FormEvent) => {
    e.preventDefault();
    createTransaction({ stampAmount: stampsToGive });
  };

  const handleSubmitRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    createTransaction({ redemptionRuleId: redemptionRule?.id });
  };

  async function createTransaction(props: { stampAmount?: number; redemptionRuleId?: string }) {
    const { stampAmount, redemptionRuleId } = props;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://xgidujoanslsfwwtqidj.supabase.co/functions/v1/create-stamp-transaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM`,
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            redemption_rule_id: redemptionRuleId,
            stamp_amount: stampAmount,
          }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        if (result && result.error) {
          throw new Error(result.error);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Failed to submit form';
      setError(errorText);
      alert(errorText);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsInitLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://xgidujoanslsfwwtqidj.supabase.co/rest/v1/redemption_rule?campaign_id=eq.${campaignId}&select=*`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM`,
              apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM',
            },
          },
        );

        const result = await response.json();
        if (!response.ok) {
          if (result && result.error) {
            throw new Error(result.error);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        setRedemptionRules(
          result.map((item: any) => ({
            id: item.id,
            name: item.reward_title,
          })),
        );
      } catch (err) {
        const errorText = err instanceof Error ? err.message : 'Failed to get redemption rules.';
        setError(errorText);
        alert(errorText);
      } finally {
        setIsInitLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isInitLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-1/2 pl-1">
      <h1 className="text-xl font-semibold">Stamp Actions</h1>
      <p className="text-sm text-muted-foreground">This is where you can give your customers stamps or redeem their rewards.</p>
      <div className="flex items-center py-4">
        <form className="w-full space-y-6">
          {/* Customer Search Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-['Inter']">Customer</Label>
              <Command className="border">
                <CommandInput 
                  placeholder="Search for a customer..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  onFocus={() => {
                    if (selectedCustomer) {
                      setSearchQuery("");
                      setSelectedCustomer(null);
                    }
                  }}
                />
                {searchQuery && !selectedCustomer && (
                  <CommandList>
                    <CommandEmpty>No customers found.</CommandEmpty>
                    <CommandGroup>
                      {filteredCustomers.map((customer) => (
                        <CommandItem
                          key={customer.id}
                          onSelect={() => handleCustomerSelect(customer)}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span>{customer.name}</span>
                            <span className="text-sm text-muted-foreground">{customer.email}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                )}
              </Command>
            </div>

            {/* Campaign Selection */}
            <div className="space-y-2">
              <Label htmlFor="campaign" className="font-['Inter']">Campaign</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.value}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Stamps Management Section */}
            <div className="space-y-4 mt-6">
              <div className="w-full">
                <Tabs defaultValue="give-stamps" className="w-full">
                  <TabsList className="grid w-1/2 grid-cols-2">
                    <TabsTrigger value="give-stamps">Give Stamps</TabsTrigger>
                    <TabsTrigger value="redeem-rewards">Redeem Rewards</TabsTrigger>
                  </TabsList>
                  <TabsContent value="give-stamps">
                    <Card>
                      <CardHeader>
                        <CardTitle>Give Stamps</CardTitle>
                        <CardDescription>
                          Give stamps according to the purchase value. Any doubts kindly
                          approach supervisor.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-6">
                        <div>
                          <Label>Number of stamps to give</Label>
                          <div className="flex w-40 items-center rounded-lg border">
                            <button
                              type="button"
                              className="p-2 pl-4"
                              onClick={(e) => {
                                e.preventDefault();
                                setStampsToGive(Math.max(stampsToGive - 1, 1));
                              }}
                            >
                              -
                            </button>
                            <Input
                              type="text"
                              disabled
                              value={stampsToGive}
                              onChange={(e) => setStampsToGive(Math.max(Number(e.target.value), 1))}
                              className="w-full border-0 text-center"
                            />
                            <button
                              type="button"
                              className="p-2 pr-4"
                              onClick={(e) => {
                                e.preventDefault();
                                setStampsToGive(stampsToGive + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type="submit"
                          className="w-full bg-[var(--color-dibs-red)] text-white hover:bg-[var(--color-dibs-red-hover)] active:bg-[var(--color-dibs-red-pressed)]"
                          disabled={isLoading}
                          onClick={handleSubmitStamp}
                        >
                          {isLoading ? 'Processing...' : 'Give stamps'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="redeem-rewards">
                    <Card>
                      <CardHeader>
                        <CardTitle>Redeem Rewards</CardTitle>
                        <CardDescription>
                          Help customers redeem their rewards.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-6">
                        <Label>Reward to redeem</Label>
                        <Select
                          onValueChange={(value) => {
                            const selected = redemptionRules.find(
                              (rule) => rule.id === value,
                            );
                            setRedemptionRule(selected || undefined);
                          }}
                        >
                          <SelectTrigger id="framework">
                            <SelectValue placeholder="Select">
                              {redemptionRule ? redemptionRule.name : 'Select'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {redemptionRules.map((rule) => (
                              <SelectItem key={rule.id} value={rule.id ?? ''}>
                                {rule.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type="submit"
                          className="w-full bg-[var(--color-dibs-red)] text-white hover:bg-[var(--color-dibs-red-hover)] active:bg-[var(--color-dibs-red-pressed)]"
                          disabled={isLoading}
                          onClick={handleSubmitRedeem}
                        >
                          {isLoading ? 'Processing...' : 'Redeem rewards'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
