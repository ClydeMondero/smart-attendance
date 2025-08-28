import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactProps {
  title?: string;
  description?: string;
  emailLabel?: string;
  emailDescription?: string;
  email?: string;
  officeLabel?: string;
  officeDescription?: string;
  officeAddress?: string;
  phoneLabel?: string;
  phoneDescription?: string;
  phone?: string;
  chatLabel?: string;
  chatDescription?: string;
  chatLink?: string;
}

const Contact = ({
  title = "Contact Us",
  description = "Reach out to our support team for any inquiries.",
  emailLabel = "Email",
  emailDescription = "We respond to all emails within 24 hours.",
  email = "contact@askadoer.ca",
  officeLabel = "Office",
  officeDescription = "Drop by our office for a chat.",
  officeAddress = "123 Thunder Bay Blvd, Thunder Bay, ON, P7B 5E1",
  phoneLabel = "Phone",
  phoneDescription = "We're available Mon-Fri, 9am-5pm.",
  phone = "+123 456 7890",
  chatLabel = "Live Chat",
  chatDescription = "Get instant help from our support team.",
  chatLink = "Start Chat",
}: ContactProps) => {
  return (
    <section className="py-12 px-12 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:gap-20">
        {/* Left side - Title + Contact details grid */}
        <div className="flex-1">
          <div className="mb-10">
            <h1 className="mb-3 text-4xl font-serif md:text-5xl">{title}</h1>
            <p className="text-muted-foreground max-w-xl text-lg">
              {description}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-muted rounded-lg p-6">
              <span className="bg-accent mb-3 flex size-12 items-center justify-center rounded-full">
                <Mail className="h-6 w-auto" />
              </span>
              <p className="mb-2 text-lg font-semibold">{emailLabel}</p>
              <p className="text-muted-foreground mb-3">{emailDescription}</p>
              <a
                href={`mailto:${email}`}
                className="font-semibold hover:underline"
              >
                {email}
              </a>
            </div>
            <div className="bg-muted rounded-lg p-6">
              <span className="bg-accent mb-3 flex size-12 items-center justify-center rounded-full">
                <MapPin className="h-6 w-auto" />
              </span>
              <p className="mb-2 text-lg font-semibold">{officeLabel}</p>
              <p className="text-muted-foreground mb-3">{officeDescription}</p>
              <a href="#" className="font-semibold hover:underline">
                {officeAddress}
              </a>
            </div>
            <div className="bg-muted rounded-lg p-6">
              <span className="bg-accent mb-3 flex size-12 items-center justify-center rounded-full">
                <Phone className="h-6 w-auto" />
              </span>
              <p className="mb-2 text-lg font-semibold">{phoneLabel}</p>
              <p className="text-muted-foreground mb-3">{phoneDescription}</p>
              <a
                href={`tel:${phone}`}
                className="font-semibold hover:underline"
              >
                {phone}
              </a>
            </div>
            <div className="bg-muted rounded-lg p-6">
              <span className="bg-accent mb-3 flex size-12 items-center justify-center rounded-full">
                <MessageCircle className="h-6 w-auto" />
              </span>
              <p className="mb-2 text-lg font-semibold">{chatLabel}</p>
              <p className="text-muted-foreground mb-3">{chatDescription}</p>
              <a href="#" className="font-semibold hover:underline">
                {chatLink}
              </a>
            </div>
          </div>
        </div>

        {/* Right side - Contact Form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="mx-auto flex flex-col gap-6 rounded-lg border p-10 shadow-sm">
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">First Name</Label>
                <Input type="text" id="firstname" placeholder="First Name" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">Last Name</Label>
                <Input type="text" id="lastname" placeholder="Last Name" />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input type="text" id="subject" placeholder="Subject" />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea placeholder="Type your message here." id="message" />
            </div>
            <Button className="w-full">Send Message</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
