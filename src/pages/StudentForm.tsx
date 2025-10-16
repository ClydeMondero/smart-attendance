import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import * as Yup from "yup";

// --- Types ---
type StudentFormData = {
  barcode: string;
  full_name: string;
  parent_name: string;
  parent_contact: string;
  class_id: string;
};

// --- Validation ---
const StudentSchema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  parent_name: Yup.string().required("Parent name is required"),
  parent_contact: Yup.string().required("Parent contact is required"),
  class_id: Yup.string().required("Class is required"),
});

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { role } = useUserStore();

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string>("");

  // Fetch classes
  const { data: classesResponse, isLoading: loadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => (await api.get("/classes")).data,
  });
  const classes = classesResponse?.data || [];

  // Fetch student if edit
  const { data: studentResponse, isLoading: loadingStudent } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => (await api.get(`/students/${id}`)).data,
    enabled: isEdit,
  });

  // Mutations
  const createStudent = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post("/students", formData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Student created successfully!");
      navigate(`/${role}/students`);
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Failed to create student.";
      toast.error(message);
    },
  });

  const updateStudent = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      formData.append("_method", "PUT");
      const res = await api.post(`/students/${id}`, formData);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Student updated successfully!");
      navigate(`/${role}/students`);
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Failed to update student.";
      toast.error(message);
    },
  });

  // --- Helpers ---
  const validatePhoto = (file: File): boolean => {
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("File size must be less than 2MB");
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError("Only jpeg, png, jpg, gif are allowed");
      return false;
    }

    setPhotoError("");
    return true;
  };

  const handleProfileDrop = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (validatePhoto(file)) {
        setProfileFile(file);
        setProfilePreview(URL.createObjectURL(file));
      }
    }
  };

  useEffect(() => {
    if (isEdit && studentResponse?.photo_url) {
      setProfilePreview(studentResponse.photo_url);
    }
  }, [isEdit, studentResponse]);

  const initialValues: StudentFormData = {
    barcode: studentResponse?.barcode || "",
    full_name: studentResponse?.full_name || "",
    parent_name: studentResponse?.parent_name || "",
    parent_contact: studentResponse?.parent_contact || "",
    class_id: studentResponse?.class_id ? String(studentResponse.class_id) : "",
  };

  if (loadingClasses || (isEdit && loadingStudent)) {
    return (
      <div className="flex flex-col min-h-screen w-full p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate(`/${role}/students`)}>
                Students
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEdit ? "Edit Student" : "Create Student"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-3xl bg-white space-y-5 p-6 rounded-md">
            <div className="space-y-2 flex items-center gap-4">
              <Skeleton className="h-15 w-15 rounded-full" />
              <Skeleton className="h-15 w-full" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
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
            <BreadcrumbLink onClick={() => navigate(`/${role}/students`)}>
              Students
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEdit ? "Edit Student" : "Create Student"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-3xl bg-white p-6 rounded-md">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={StudentSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const formData = new FormData();
              formData.append("full_name", values.full_name);
              formData.append("parent_name", values.parent_name);
              formData.append("parent_contact", values.parent_contact);
              formData.append("class_id", values.class_id);

              if (profileFile) {
                formData.append("photo", profileFile);
              }

              try {
                if (isEdit) {
                  await updateStudent.mutateAsync({ id: id!, formData });
                } else {
                  await createStudent.mutateAsync(formData);
                }
              } catch (err) {
                console.error(err);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-5">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    {profilePreview && (
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profilePreview} alt="profile" />
                      </Avatar>
                    )}
                    <Dropzone
                      maxFiles={1}
                      onDrop={handleProfileDrop}
                      onError={() => setPhotoError("Failed to upload file")}
                      className="border-2 border-dashed border-gray-300 rounded-md p-4 flex-1 hover:border-gray-500 transition-colors"
                    >
                      <DropzoneEmptyState>
                        {profilePreview
                          ? "Drag or click to replace photo"
                          : "Drag or click to upload photo"}
                      </DropzoneEmptyState>
                      <DropzoneContent />
                    </Dropzone>
                  </div>
                  {photoError && (
                    <p className="text-red-500 text-sm">{photoError}</p>
                  )}
                </div>

                {/* Barcode (read-only when editing) */}
                {isEdit && (
                  <div className="space-y-2">
                    <Label>Barcode</Label>
                    <Field as={Input} name="barcode" readOnly disabled />
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Field
                    as={Input}
                    name="full_name"
                    placeholder="Enter full name"
                  />
                  <ErrorMessage
                    name="full_name"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Parent Name */}
                <div className="space-y-2">
                  <Label>Parent Name</Label>
                  <Field
                    as={Input}
                    name="parent_name"
                    placeholder="Enter parent name"
                  />
                  <ErrorMessage
                    name="parent_name"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Parent Contact */}
                <div className="space-y-2">
                  <Label>Parent Contact</Label>
                  <Field
                    as={Input}
                    name="parent_contact"
                    placeholder="Enter parent contact"
                  />
                  <ErrorMessage
                    name="parent_contact"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Class */}
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select
                    value={values.class_id}
                    onValueChange={(val) => setFieldValue("class_id", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c: any) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {`${c.grade_level} - ${c.section} (${c.teacher})`}
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

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isSubmitting ||
                    createStudent.isPending ||
                    updateStudent.isPending ||
                    !!photoError
                  }
                >
                  {isSubmitting ||
                  createStudent.isPending ||
                  updateStudent.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : isEdit ? (
                    "Update Student"
                  ) : (
                    "Save Student"
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
