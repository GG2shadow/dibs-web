"use client"

import * as React from "react"
import { Stamp } from 'lucide-react';
import { Progress } from "@/components/ui/progress"

interface StampCard {
  id: string;
  title: string;
  endDate: string;
  progress: number;
}

interface OurStampCardsListProps {
  cards: StampCard[];
}

const OurStampCardsList = ({ cards }: OurStampCardsListProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-start text-2xl font-bold">Stamp Cards</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Stamp />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Ends on {card.endDate}
                  </p>
                  <div className="mt-2">
                    <Progress value={card.progress} className="w-full bg-black" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {card.progress}% completed
                    </p>
                  </div>
                  <button className="mt-2 text-left text-sm text-primary hover:underline">
                    Login to open stamp card
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { OurStampCardsList }; 