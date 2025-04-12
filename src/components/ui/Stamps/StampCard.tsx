'use client';

import React, { useState, useEffect } from 'react';

import { useParams } from 'next/navigation';

import { SiTicktick } from 'react-icons/si';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StampCardProps {
  signupText?: string;
}

interface RedemptionRule {
  id: string;
  total_stamps: number;
  reward_title: string;
  reward_desc: string;
  is_redeemed: boolean;
}

const StampCard = ({
  signupText = 'Add stamps to account',
}: StampCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coloredStamps, setColoredStamps] = useState(0);
  const [stampCount, setStampCount] = useState(0);
  const [timelineData, setTimelineData] = useState<RedemptionRule[]>([]);
  const stampsCollected = coloredStamps;

  const { uuid } = useParams(); // Extract the dynamic route parameter

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://xgidujoanslsfwwtqidj.supabase.co/functions/v1/get-stamp-card?customer_stamp_id=${uuid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM`,
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
        setColoredStamps(result.total_stamps);
        setTimelineData(result.redemptions);
        setStampCount(
          Math.max(
            ...(result.redemptions as RedemptionRule[]).map(
              (item) => item.total_stamps,
            ),
          ),
        );
      } catch (err) {
        const errorText =
          err instanceof Error ? err.message : 'Failed to submit form';
        setError(errorText);
        alert(errorText);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen p-8">
      <div className="container mx-auto flex flex-col gap-8 md:flex-row">
        {/* Timeline Section - Left Side */}
        <div className="md:w-1/2">
          <div className="relative mx-auto max-w-4xl">
            <div className="timeline-line absolute h-full w-1 -translate-x-1/2 transform bg-gray-200" />

            <div className="space-y-8">
              {timelineData.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col ${
                    0 % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-center justify-end`}
                >
                  <div
                    className={`w-full rounded-lg bg-white p-6 shadow-md md:w-1/2 ${
                      0 % 2 === 0
                        ? 'md:mr-4 md:text-right'
                        : 'md:ml-4 md:text-left'
                    } ${coloredStamps < item.total_stamps ? 'disabled-reward' : ''} ${
                      item.is_redeemed ? 'redeemed-reward' : 'not-redeemed'
                    }`}
                  >
                    <div className="reward-container">
                      <div className="redeemed-marker">
                        <SiTicktick
                          className={`h-10 w-10 ${'text-yellow-500'}`}
                        />
                      </div>
                      <div className="reward-content">
                        <h3 className={`text-lg font-bold text-yellow-500`}>
                          {item.total_stamps} Stamps
                        </h3>
                        <h4 className="mt-2 mb-1 text-xl font-semibold">
                          {item.reward_title}
                        </h4>
                        <p className="text-gray-600">{item.reward_desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:h-6 md:w-6 md:transform-none">
                    <div
                      className={`h-4 w-4 rounded-full ${
                        coloredStamps < item.total_stamps
                          ? 'bg-gray-400'
                          : 'bg-yellow-500'
                      } ring-4 ring-white`}
                    />
                  </div>

                  {/* <div className="hidden md:block md:w-5/12" /> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stamp Card Section - Right Side */}
        <div className="md:w-1/2">
          <div className="flex flex-col gap-4">
            <div className="w-full max-w-sm rounded-md p-6 shadow">
              <p className="my-3 mb-4 text-center text-lg font-semibold">
                You now have {stampsCollected} stamps!
              </p>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: stampCount }).map((_, index) => (
                  <div key={index} className="m-1 flex-1">
                    <SiTicktick
                      className={`h-10 w-10 ${
                        index < coloredStamps
                          ? 'text-yellow-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .timeline-line {
          right: 12px;
        }
        @media (max-width: 766px) {
          .timeline-line {
            right: calc(50% - 4px);
          }
        }
        .reward-container {
          position: relative;
        }
        .disabled-reward {
          background-color: #eeeeee;
          color: rgb(156, 163, 175);
        }
        .disabled-reward h3 {
          color: rgb(156, 163, 175);
        }
        .disabled-reward p {
          color: rgb(156, 163, 175);
        }
        .redeemed-reward {
          outline: solid 5px rgb(234, 179, 8);
        }
        .redeemed-reward .reward-content {
          opacity: 1;
        }
        .not-redeemed .redeemed-marker {
          display: none;
        }
        .redeemed-marker {
          z-index: 10;
          position: absolute;
        }
        @media (max-width: 766px) {
          .redeemed-marker {
            right: 0;
          }
        }
      `}</style>
    </section>
  );
};

export { StampCard };
