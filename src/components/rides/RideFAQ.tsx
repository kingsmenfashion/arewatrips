import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I book a ride?",
    answer:
      "Simply fill out the booking form above with your pickup and dropoff locations, date, and time. Click 'Get Quote via WhatsApp' and we'll respond within minutes with availability and pricing.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept cash, bank transfers, and mobile payments. Payment is made directly to the driver upon completion of your ride or in advance via bank transfer.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Yes, you can cancel your booking anytime via WhatsApp. We appreciate at least 2 hours notice for cancellations to help us serve you better.",
  },
  {
    question: "Are drivers verified?",
    answer:
      "All our drivers are thoroughly vetted with valid licenses, background checks, and local knowledge. Your safety is our top priority.",
  },
  {
    question: "Do you offer airport pickups?",
    answer:
      "Yes! Airport transfers are one of our most popular services. We monitor flight arrivals to ensure your driver is ready when you land.",
  },
];

const RideFAQ = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
              FAQ
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Common Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default RideFAQ;
