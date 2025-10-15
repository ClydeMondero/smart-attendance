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

// Types
type ClassFormData = {
  grade_level: string;
  section: string;
  teacher: string;
  school_year: string;
  status: "active" | "inactive";
};

// Validation
const CreateClassSchema = Yup.object().shape({
  grade_level: Yup.string().required("Grade level is required"),
  section: Yup.string().required("Section is required"),
  teacher: Yup.string().required("Teacher is required"),
  school_year: Yup.string().required("School year is required"),
  status: Yup.string()
    .oneOf(["active", "inactive"])
    .required("Status is required"),
});

export default function ClassesForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const res = await api.get(`/users/teachers`);
      return res.data;
    },
  });

  const { data: singleClass, isLoading: classLoading } = useQuery({
    queryKey: ["classes", id],
    queryFn: async () => {
      const res = await api.get(`/classes/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const createClass = useMutation({
    mutationFn: (values: ClassFormData) => api.post("/classes", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class created successfully!");
      navigate("/admin/classes");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create class");
    },
  });

  const updateClass = useMutation({
    mutationFn: (values: ClassFormData) => api.put(`/classes/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Classes updated successfully!");
      navigate("/admin/classes");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update class");
    },
  });

  if ((isEdit && teachersLoading) || classLoading) {
    return (
      <div className="flex flex-col min-h-screen w-full p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/admin/classes")}>
                Classes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEdit ? "Edit Class" : "Create Class"}
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

  const initialValues: ClassFormData = {
    grade_level: singleClass?.grade_level || "",
    section: singleClass?.section || "",
    teacher: singleClass?.teacher || "",
    school_year: singleClass?.school_year || "",
    status: singleClass?.status || "active",
  };

  return (
    <div className="flex flex-col min-h-screen w-full p-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/admin/classes")}>
              Clasess
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEdit ? "Edit Class" : "Create Class"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 p-6 rounded-md">
          <Formik
            initialValues={initialValues}
            validationSchema={CreateClassSchema}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              if (isEdit && id) {
                updateClass.mutate(values);
              } else {
                createClass.mutate(values);
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-5">
                {/* Grade Level */}
                <div className="space-y-2">
                  <Label htmlFor="grade_level">Grade Level</Label>
                  <Field
                    as={Input}
                    id="grade_level"
                    name="grade_level"
                    placeholder="Enter grade level"
                  />
                  <ErrorMessage
                    name="grade_level"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <Label htmlFor="grade">Section</Label>
                  <Field
                    as={Input}
                    id="sectio"
                    name="section"
                    placeholder="Enter section"
                  />
                  <ErrorMessage
                    name="section"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* School Year */}
                <div className="space-y-2">
                  <Label htmlFor="school_year">School Year</Label>
                  <Field
                    as={Input}
                    id="school_year"
                    name="school_year"
                    placeholder="Enter school year e.g. 2023-2024"
                  />
                  <ErrorMessage
                    name="school_year"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Teacher */}
                <div className="space-y-2">
                  <Label htmlFor="teacher">Teacher</Label>
                  <Select
                    value={values.teacher}
                    onValueChange={(val) => setFieldValue("teacher", val)}
                  >
                    <SelectTrigger id="teacher">
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers?.map((t: any) => (
                        <SelectItem key={t.name} value={String(t.name)}>
                          {`${t.name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="teacher"
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
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
                    createClass.isPending ||
                    updateClass.isPending
                  }
                >
                  {isSubmitting ||
                  createClass.isPending ||
                  updateClass.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : isEdit ? (
                    "Update Class"
                  ) : (
                    "Create Class"
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
