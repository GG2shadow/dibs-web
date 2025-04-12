import React, { useState, useEffect } from 'react';

import QRCode from 'react-qr-code';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card';
import OurLabel from '../OurComponents/OurLabel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Separator } from '../separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Signup2Props {
  signupText?: string;
}

interface TransactionProps {
  stampAmount?: number;
  redemptionRuleId?: string;
}

interface RedemptionRule {
  id?: string;
  name?: string;
}

interface RawRedemptionRule {
  id?: string;
  total_stamps?: number;
  reward_title?: string;
  campaign_id?: string;
  created_at?: string;
  reward_desc?: string;
}

const AdminStampsForm = ({
  signupText = 'Add stamps to account',
}: Signup2Props) => {
  const [isInitLoading, setIsInitLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stampsToGive, setStampsToGive] = useState<number>(1);
  const [redemptionRules, setRedemptionRules] = useState<RedemptionRule[]>([]);
  const [redemptionRule, setRedemptionRule] = useState<RedemptionRule>();
  const [isOpen, setIsOpen] = useState(false);
  const [qrValue, setQrValue] = useState<string | null>(null);

  const campaignId = '3c95f762-6adc-43f9-9306-27c9a091880e';

  const handleSubmitStamp = async (e: React.FormEvent) => {
    e.preventDefault();

    createTransaction({ stampAmount: stampsToGive });
  };

  const handleSubmitRedeem = async (e: React.FormEvent) => {
    e.preventDefault();

    createTransaction({ redemptionRuleId: redemptionRule?.id });
  };

  async function createTransaction(props: TransactionProps) {
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
          // Add any required body parameters here
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

      if (typeof window !== 'undefined') {
        let nextUrl = window.location.origin;
        if (stampAmount) {
          nextUrl += '/s/collect-stamps';
        } else if (redemptionRuleId) {
          nextUrl += '/s/redeem-rewards';
        }
        nextUrl += `/${result.transaction_id}`;
        setQrValue(nextUrl);
        setIsOpen(true);
      }
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : 'Failed to submit form';
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
              apikey:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM',
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
          (result as RawRedemptionRule[]).map((item) => ({
            id: item.id,
            name: item.reward_title,
          })),
        );
      } catch (err) {
        const errorText =
          err instanceof Error
            ? err.message
            : 'Failed to get redemption rules.';
        setError(errorText);
        alert(errorText);
      } finally {
        setIsInitLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (isInitLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <section className="pb-16">
        <p className="mb-6 text-sm">Campaign ID: ${campaignId}</p>
        <Tabs defaultValue="give-stamps" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
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
                  <OurLabel>Number of stamps to give</OurLabel>
                  <div className="flex w-40 items-center rounded-lg border">
                    <button
                      className="p-2 pl-4"
                      onClick={() =>
                        setStampsToGive(Math.max(stampsToGive - 1, 1))
                      } // Decrease pax, ensuring it doesn't go below 1
                    >
                      -
                    </button>
                    <Input
                      type="text"
                      disabled
                      value={stampsToGive}
                      onChange={(e) =>
                        setStampsToGive(Math.max(Number(e.target.value), 1))
                      } // Ensure pax doesn't go below 1
                      className="w-full border-0 text-center"
                    />
                    <button
                      className="p-2 pr-4"
                      onClick={() => setStampsToGive(stampsToGive + 1)} // Increase pax
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
                  {isLoading ? 'Generating QR code...' : 'Give stamps'}
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
                <OurLabel>Reward to redeem</OurLabel>
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
                  {isLoading ? 'Generating QR code...' : 'Redeem rewards'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
      {isOpen && qrValue && (
        <div
          className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-lg bg-white p-6 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-4xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            {/* <div>{qrValue}</div> */}
            <h2 className="mt-6 mb-4 text-lg font-semibold">
              Please let the customer scan the QR code below
            </h2>
            <QRCode
              value={qrValue}
              size={300}
              className="mx-auto w-full max-w-xs md:max-w-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { AdminStampsForm };
