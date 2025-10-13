import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import faqs from "@/constants/faqs";
import steps from "@/constants/steps";
import useUserStore from "@/store/userStore";
import { scrollToTop } from "@/utils/scroll";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function Home() {
  const { isLoggedIn, role } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <FAQs />
    </div>
  );
}

const Hero = () => {
  return (
    <div className="min-h-screen bg-[#0D1B2A] dark grid grid-cols-2 px-2 md:px-0">
      <div className="flex flex-col justify-center gap-8 pl-12 py-12">
        <p className="text-white text-2xl md:text-5xl text-left font-bold">
          Instant{" "}
          <span className="text-primary border-2 border-primary p-1 rounded-full">
            attendance
          </span>{" "}
          tracking with barcode scans and automated updates
        </p>
        <p className="text-muted-foreground">
          Record attendance instantly with barcode scans—no manual entry, no
          delays. Get fast, accurate tracking with automated updates that keep
          everyone informed. Save time, cut errors, and simplify attendance
          management.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            onClick={scrollToTop}
            className="py-3 px-6 bg-primary text-primary-foreground rounded-full hover:scale-105  font-semibold text-lg cursor-pointer flex items-center gap-2"
          >
            Get Started <ArrowRight />
          </Link>
        </div>
      </div>
      <img
        src="/hero-background.png"
        alt=""
        className="w-full h-screen opacity-50"
      />
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative py-12 px-6 md:px-12 bg-gradient-to-b from-muted/40 via-secondary to-muted/40"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex flex-col gap-12"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-4xl font-medium">How Smart Attendance Works</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Scan the bark code and record attendance, and the system instantly
            updates records and sends updates.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="h-full"
              >
                <Card className="shadow-md border rounded-2xl hover:shadow-lg transition h-full">
                  <CardContent className="flex flex-col justify-between gap-3 p-6 h-full">
                    <div className="flex flex-col gap-3">
                      <step.icon className="w-8 h-8 text-primary" />
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const FAQs = () => {
  return (
    <motion.div
      id="faqs"
      className="md:min-h-screen flex flex-col gap-8 justify-center py-12 px-6 md:px-12 bg-secondary"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full flex flex-col items-center justify-center gap-8">
        <p className="text-4xl font-medium">Frequently Asked Questions</p>
        {/* Questions */}
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-2xl"
          defaultValue="item-1"
        >
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-lg">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
};
