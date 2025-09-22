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
import useUserStore from "@/store/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import * as Yup from "yup";

// --- Types ---
type GradeFormData = {
  student_id: string;
  subject_id: string;
  grading_period: string;
  score: number | "";
  remarks: string;
};

// --- Validation ---
const GradeSchema = Yup.object().shape({
  student_id: Yup.string().required("Student is required"),
  subject_id: Yup.string().required("Subject is required"),
  grading_period: Yup.string().required("Grading period is required"),
  score: Yup.number()
    .typeError("Score must be a number")
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100")
    .required("Score is required"),
  remarks: Yup.string(),
});

export default function GradeForm() {
  const { id } = useParams(); // optional for edit later
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { role } = useUserStore();

  // Fetch students
  const { data: studentsResponse = {}, isLoading: loadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: async () => (await api.get("/students")).data,
  });

  const students = studentsResponse.data || []; // <-- extract the array

  // Fetch subjects
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => (await api.get("/subjects")).data,
  });

  // Mutation for creating grade
  const createGrade = useMutation({
    mutationFn: async (values: GradeFormData) => {
      const res = await api.post("/grades", values);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Grade created successfully!");
      navigate(`/${role}/grades`);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to create grade.";
      toast.error(message);
    },
  });

  // Initial form values
  const initialValues: GradeFormData = {
    student_id: "",
    subject_id: "",
    grading_period: "",
    score: "",
    remarks: "",
  };

  if (loadingStudents || loadingSubjects) {
    return (
      <div className="flex flex-col min-h-screen w-full p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate(`/${role}/grades`)}>
                Grades
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Grade</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-3xl bg-white space-y-5 p-6 rounded-md">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(`/${role}/grades`)}>
              Grades
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEdit ? "Edit Grade" : "Create Grade"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-3xl bg-white p-6 rounded-md">
          <Formik
            initialValues={initialValues}
            validationSchema={GradeSchema}
            onSubmit={(values, { setSubmitting }) => {
              createGrade.mutate(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-5">
                {/* Student */}
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select
                    value={values.student_id}
                    onValueChange={(val) => setFieldValue("student_id", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((s: any) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="student_id"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={values.subject_id}
                    onValueChange={(val) => setFieldValue("subject_id", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s: any) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="subject_id"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Grading Period */}
                <div className="space-y-2">
                  <Label>Grading Period</Label>
                  <Field
                    as={Input}
                    name="grading_period"
                    placeholder="e.g. First Quarter"
                  />
                  <ErrorMessage
                    name="grading_period"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Score */}
                <div className="space-y-2">
                  <Label>Score</Label>
                  <Field
                    as={Input}
                    type="number"
                    name="score"
                    placeholder="0 - 100"
                  />
                  <ErrorMessage
                    name="score"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Field
                    as={Input}
                    name="remarks"
                    placeholder="Optional remarks"
                  />
                  <ErrorMessage
                    name="remarks"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || createGrade.isPending}
                >
                  {isSubmitting || createGrade.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Save Grade"
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
