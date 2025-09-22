import { Button } from "@/components/ui/button";
import useUserStore from "@/store/userStore";
import { Link } from "react-router";

const NotAuthorized = () => {
  const { role } = useUserStore();

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center">
      <h1 className="scroll-m-20 text-primary text-center text-8xl font-extrabold tracking-tight text-balance">
        403
      </h1>
      <p className="text-center text-2xl text-secondary-foreground">
        Access Denied! You don't have permission to view this page.
      </p>
      <p className="text-center text-md text-muted-foreground">
        This page is restricted or you may need additional privileges.
      </p>
      <Button asChild className="mt-4">
        <Link
          to={`${role == "teacher" ? "/teacher/classes" : "/admin/dashboard"}`}
        >
          Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotAuthorized;
