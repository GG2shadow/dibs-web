import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const categories = [
  {
    title: 'Your account',
    questions: [
      {
        question: 'How do I get started to try the product and services?',
        answer:
          "Fill up the contact form and we'\ll get in touch within hours.",
      },
    ],
  },
  {
    title: 'Support',
    questions: [
      {
        question: 'How can I contact customer support?',
        answer:
          'You can reach our customer support team via email at hello@usedibs.com.',
      },
    ],
  },
];

export const FAQ = ({
  headerTag = 'h2',
  className,
  className2,
}: {
  headerTag?: 'h1' | 'h2';
  className?: string;
  className2?: string;
}) => {
  return (
    <section className={cn('py-28 lg:py-32', className)}>
      <div className="container max-w-5xl">
        <div className={cn('mx-auto grid gap-16 lg:grid-cols-2', className2)}>
          <div className="space-y-4">
            {headerTag === 'h1' ? (
              <h1 className="text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                Got Questions?
              </h1>
            ) : (
              <h2 className="text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                Got Questions?
              </h2>
            )}
            <p className="text-muted-foreground max-w-md leading-snug font-medium lg:mx-auto">
              If you can't find what you're looking for,{' '}
              <Link href="/contact" className="underline underline-offset-4">
                get in touch
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-6 text-start">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} className="">
                <h3 className="text-muted-foreground border-b py-4 font-medium">
                  {category.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${categoryIndex}-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
