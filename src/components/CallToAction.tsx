import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { scrollToTop } from "@/utils/scroll";

interface CallToActionProps {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const CallToAction = ({
  heading = "Ready to Get Things Done?",
  description = "Join our growing community of Doers and Clients. Whether you want to offer your skills or find trusted help, everything starts here.",
  buttons = {
    primary: {
      text: "Get Started",
      url: "/signup", // or your sign-up route
    },
  },
}: CallToActionProps) => {
  return (
    <div className="md:min-h-[50vh] bg-secondary flex w-full flex-col gap-16 p-8  lg:flex-row lg:items-center lg:p-12 dark">
      <div className="flex-1">
        <h3 className="mb-3 text-primary text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
          {heading}
        </h3>
        <p className="text-muted-foreground max-w-xl lg:text-lg">
          {description}
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
        {buttons.primary && (
          <Button asChild variant="default" size="lg">
            <Link to={buttons.primary.url} onClick={() => scrollToTop()}>
              {buttons.primary.text}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CallToAction;
