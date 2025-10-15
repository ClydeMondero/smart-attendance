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

    // Fetch classes
    const { data: classesResponse, isLoading: loadingClasses } = useQuery({
        queryKey: ["classes"],
        queryFn: async () => {
            const res = await api.get("/classes");
            return res.data;
        },
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
        mutationFn: async (values: Omit<StudentFormData, "barcode">) => {
            const res = await api.post("/students", values);
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
        mutationFn: async (values: StudentFormData) => {
            const res = await api.put(`/students/${id}`, values);
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
                        onSubmit={(values, { setSubmitting }) => {
                            if (isEdit) {
                                updateStudent.mutate(values);
                            } else {
                                const { barcode, ...rest } = values;
                                createStudent.mutate(rest);
                            }
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form className="space-y-5">
                                {/* Barcode */}
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
                                        updateStudent.isPending
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

