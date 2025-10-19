import { faqs } from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="py-20 mb-10 px-6 sm:px-12 lg:px-20 border-t border-border bg-gradient-to-b from-muted/40 to-background relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Find quick answers to the most common questions about QuizMaster — your CS fundamentals quiz companion.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-xl bg-card hover:bg-muted/50 transition-colors duration-300"
            >
              <AccordionTrigger className="text-left px-6 py-4 font-semibold text-foreground hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Decorative background blobs */}
      <div className="absolute -z-10 w-[25rem] h-[25rem] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl top-10 left-0" />
      <div className="absolute -z-10 w-[22rem] h-[22rem] bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl bottom-0 right-0" />
    </section>
  );
}
