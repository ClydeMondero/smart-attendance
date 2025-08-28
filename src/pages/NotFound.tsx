import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center">
      <h1 className="scroll-m-20 text-center text-8xl font-extrabold tracking-tight text-balance">
        404
      </h1>
      <p className="text-center text-2xl text-secondary-foreground">
        Oops! This Page Could Not Be Found
      </p>
      <p className="text-center text-md text-muted-foreground">
        This link might be corrupted or the page is removed
      </p>
      <Button asChild className="mt-4">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
