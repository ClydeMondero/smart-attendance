import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik } from "formik";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import * as Yup from "yup";

// --- Types ---
type AnnouncementFormData = {
  class_id?: string;
  message: string;
};

// --- Validation ---
const SendAnnouncementSchema = Yup.object().shape({
  class_id: Yup.string(),
  message: Yup.string().required("Message is required"),
});

// --- API Hooks ---

function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await api.get("/classes");
      return res.data.data;
    },
  });
}

export default function Announcement() {
  const { data: classes, isLoading: classesLoading } = useClasses();

  const sendAnnouncement = useMutation({
    mutationFn: (values: AnnouncementFormData) =>
      api.post("/announcement", values),
    onSuccess: () => {
      toast.success("Announcement sent successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to send announcement");
    },
  });

  if (classesLoading) {
    return (
      <div className="flex flex-col min-h-screen w-full p-6">
        <h2 className="text-xl font-semibold">Announcement</h2>

        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 space-y-5 p-6 rounded-md">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const initialValues: AnnouncementFormData = {
    class_id: "",
    message:
      "Good day,\n\n//CONTENT GOES HERE\n\nThank you for your continued support and trust in Smart Attendance.\n\nWarm regards,\n\nSmart Attendance Admin Team",
  };

  return (
    <div className="flex flex-col min-h-screen w-full p-6">
      <h2 className="text-xl font-semibold">Announcement</h2>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 p-6 rounded-md">
          <Formik
            initialValues={initialValues}
            validationSchema={SendAnnouncementSchema}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              sendAnnouncement.mutate(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-5">
                {/* Class */}
                <div className="space-y-2">
                  <Label htmlFor="class_id">Class</Label>
                  <Select
                    value={values.class_id}
                    onValueChange={(val) => setFieldValue("class_id", val)}
                  >
                    <SelectTrigger id="class_id">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map((cls: any) => (
                        <SelectItem key={cls.id} value={String(cls.id)}>
                          {cls.grade_level} - {cls.section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="class_id"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  <span className="text-muted-foreground text-sm">
                    If you choose to send an announcement, it will be sent to
                    all students in the selected class. Leave it blank to send
                    to all classes.
                  </span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    rows={10}
                    value={values.message}
                    onChange={(e) => setFieldValue("message", e.target.value)}
                  />
                  <ErrorMessage
                    name="message"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || sendAnnouncement.isPending}
                >
                  {isSubmitting || sendAnnouncement.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Send Announcement"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
