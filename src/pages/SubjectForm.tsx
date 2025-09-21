import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import * as Yup from "yup";

// --- Types ---
type SubjectFormData = {
  name: string;
  class_id: string;
  status: "Active" | "Inactive";
};

// --- Validation ---
const CreateSubjectSchema = Yup.object().shape({
  name: Yup.string().required("Subject name is required"),
  class_id: Yup.string().required("Class is required"),
  status: Yup.string()
    .oneOf(["Active", "Inactive"])
    .required("Status is required"),
});

// --- API Hooks ---
function useSubject(id?: string) {
  return useQuery({
    queryKey: ["subjects", id],
    queryFn: async () => {
      const res = await api.get(`/subjects/${id}`);
      console.log(res.data);
      return res.data;
    },
    enabled: !!id,
  });
}

function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await api.get("/classes");
      return res.data.data;
    },
  });
}

export default function SubjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();

  const { data: subject, isLoading: subjectLoading } = useSubject(id);
  const { data: classes, isLoading: classesLoading } = useClasses();

  const createSubject = useMutation({
    mutationFn: (values: SubjectFormData) => api.post("/subjects", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject created successfully!");
      navigate("/admin/subjects");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create subject");
    },
  });

  const updateSubject = useMutation({
    mutationFn: (values: SubjectFormData) => api.put(`/subjects/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject updated successfully!");
      navigate("/admin/subjects");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update subject");
    },
  });

  if ((isEdit && subjectLoading) || classesLoading) {
    return (
      <div className="flex flex-col min-h-screen w-full p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/admin/subjects")}>
                Subjects
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEdit ? "Edit Subject" : "Create Subject"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 space-y-5 p-6 rounded-md">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const initialValues: SubjectFormData = {
    name: subject?.name || "",
    class_id: subject?.class_id ? String(subject.class_id) : "",
    status: subject?.status
      ? subject.status.charAt(0).toUpperCase() +
        subject.status.slice(1).toLowerCase()
      : "Active",
  };

  return (
    <div className="flex flex-col min-h-screen w-full p-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/admin/subjects")}>
              Subjects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEdit ? "Edit Subject" : "Create Subject"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 p-6 rounded-md">
          <Formik
            initialValues={initialValues}
            validationSchema={CreateSubjectSchema}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              if (isEdit && id) {
                updateSubject.mutate(values);
              } else {
                createSubject.mutate(values);
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-5">
                {/* Subject Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="Enter subject name"
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

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
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={values.status}
                    onValueChange={(val) => setFieldValue("status", val)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="status"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isSubmitting ||
                    createSubject.isPending ||
                    updateSubject.isPending
                  }
                >
                  {isSubmitting ||
                  createSubject.isPending ||
                  updateSubject.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : isEdit ? (
                    "Update Subject"
                  ) : (
                    "Create Subject"
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
