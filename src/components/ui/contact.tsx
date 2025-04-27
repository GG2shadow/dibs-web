import React from 'react';

import Link from 'next/link';

import { DashedLine } from '../dashed-line';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PiInstagramLogo, PiTiktokLogo } from 'react-icons/pi';

const contactInfo = [
  {
    title: 'Corporate office',
    content: (
      <p className="text-muted-foreground mt-3">
        The Sandbox, Ngee Ann Polytechnic
        <br />
        Block 56, #01-03
        <br />
        535 Clementi Rd, Singapore 599489
      </p>
    ),
  },
  {
    title: 'Email us',
    content: (
      <div className="mt-3">
        <div>
          <p className="">Careers</p>
          <Link
            href="mailto:careers@usedibs.com"
            className="text-muted-foreground hover:text-foreground"
          >
            careers@usedibs.com
          </Link>
        </div>
        <div className="mt-1">
          <p className="">Press</p>
          <Link
            href="mailto:press@usedibs.com"
            className="text-muted-foreground hover:text-foreground"
          >
            press@usedibs.com
          </Link>
        </div>
      </div>
    ),
  },
  // {
  //   title: 'Follow us',
  //   content: (
  //     <div className="mt-3 flex gap-6 lg:gap-10">
  //       <Link href="#" className="text-muted-foreground hover:text-foreground">
  //         <PiTiktokLogo className="size-5" />
  //       </Link>
  //       <Link href="#" className="text-muted-foreground hover:text-foreground">
  //         <PiInstagramLogo className="size-5" />
  //       </Link>
  //     </div>
  //   ),
  // },
];

export default function Contact() {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container max-w-2xl">
        <h1 className="text-center text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          Contact us
        </h1>
        <p className="text-muted-foreground mt-4 text-center leading-snug font-medium lg:mx-auto">
          We strive to respond within 24 hours. If you have an urgent request, please WhatsApp +65 8716 9250.
        </p>

        <div className="mt-10 flex justify-between gap-8 max-sm:flex-col md:mt-14 lg:mt-20 lg:gap-12">
          {contactInfo.map((info, index) => (
            <div key={index}>
              <h2 className="font-medium">{info.title}</h2>
              {info.content}
            </div>
          ))}
        </div>

        <DashedLine className="my-12" />

        {/* Inquiry Form */}
        <div className="mx-auto">
          <h2 className="text-lg font-semibold">Inquiries</h2>
          <form className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input placeholder="First and last name" />
            </div>
            <div className="space-y-2">
              <Label>Work email address</Label>
              <Input placeholder="me@company.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label>
                Company name{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input placeholder="Company name" />
            </div>
            <div className="space-y-2">
              <Label>
                Number of employees{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input placeholder="e.g. 10-50" />
            </div>
            <div className="space-y-2">
              <Label>Your message</Label>
              <Textarea
                placeholder="Write your message"
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button size="lg" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
