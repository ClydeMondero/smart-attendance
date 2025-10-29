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
    .typeError("Grade must be a number")
    .min(0, "Grade must be at least 0")
    .max(100, "Grade cannot exceed 100")
    .required("Grade is required"),
  remarks: Yup.string(),
});
export default function GradeForm() {
  const { id } = useParams(); // grade id for edit
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { role } = useUserStore();

  // Fetch students
  const { data: studentsResponse = {}, isLoading: loadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: async () => (await api.get("/students")).data,
  });

  const students = studentsResponse.data || [];

  // Fetch subjects
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => (await api.get("/subjects")).data,
  });

  // Fetch grade if editing
  const { data: gradeData, isLoading: loadingGrade } = useQuery({
    queryKey: ["grade", id],
    queryFn: async () => (id ? (await api.get(`/grades/${id}`)).data : null),
    enabled: isEdit,
  });

  // Mutation for creating or updating
  const saveGrade = useMutation({
    mutationFn: async (values: GradeFormData) => {
      if (isEdit) {
        const res = await api.put(`/grades/${id}`, values);
        return res.data;
      } else {
        const res = await api.post("/grades", values);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(`Grade ${isEdit ? "updated" : "created"} successfully!`);
      navigate(`/${role}/grades`);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to save grade.";
      toast.error(message);
    },
  });

  if (loadingStudents || loadingSubjects || (isEdit && loadingGrade)) {
    return (
      <div className="flex flex-col min-h-screen w-full p-6">
        {/* ...same skeleton loader as before */}
      </div>
    );
  }

  const initialValues: GradeFormData & { student_id_class_id?: string | null } =
    {
      student_id: gradeData?.student?.id ? String(gradeData.student.id) : "",
      student_id_class_id:
        gradeData?.student?.class_id || gradeData?.subject?.class_id || null,
      subject_id: gradeData?.subject_id ? String(gradeData.subject_id) : "",
      grading_period: gradeData?.grading_period || "",
      score: gradeData?.score || "",
      remarks: gradeData?.remarks || "",
    };

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
            enableReinitialize // important for edit mode
            initialValues={initialValues}
            validationSchema={GradeSchema}
            onSubmit={(values, { setSubmitting }) => {
              saveGrade.mutate(values);
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
                    onValueChange={(val) => {
                      const student = students.find(
                        (s: any) => String(s.id) === val
                      );
                      setFieldValue("student_id", val);
                      setFieldValue(
                        "student_id_class_id",
                        student?.class_id || null
                      );
                      setFieldValue("subject_id", ""); // reset subject when student changes
                    }}
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
                    disabled={!values.student_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects
                        .filter(
                          (subject: any) =>
                            subject.class_id === values.student_id_class_id
                        )
                        .map((s: any) => (
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
                  <Label>Grade</Label>
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
                  disabled={isSubmitting || saveGrade.isPending}
                >
                  {isSubmitting || saveGrade.isPending ? (
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
