import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useTemplateSettings } from "@/hooks/useSettings";
import { useSyncSettings } from "@/hooks/useSyncSettings";
import useSettingStore from "@/store/useSettingStore";
import { LoaderCircle } from "lucide-react";

export default function Setting() {
  useSyncSettings();
  const {
    schoolInTemplate,
    setSchoolInTemplate,
    schoolOutTemplate,
    setSchoolOutTemplate,
    classAttendanceTemplate,
    setClassAttendanceTemplate,
    classAbsenceTemplate,
    setClassAbsenceTemplate,
  } = useSettingStore();

  type template = "class" | "classAbsence" | "schoolIn" | "schoolOut";

  const { mutate, isPending } = useTemplateSettings();

  const handleUpdate = (templateType: template) => {
    // Map template type
    const templateSetting =
      templateType === "class"
        ? "class_in_template"
        : templateType === "classAbsence"
        ? "class_absent_template"
        : templateType === "schoolIn"
        ? "school_in_template"
        : "school_out_template";

    // Map template value
    const newValue =
      templateType === "class"
        ? classAttendanceTemplate
        : templateType === "classAbsence"
        ? classAbsenceTemplate
        : templateType === "schoolIn"
        ? schoolInTemplate
        : schoolOutTemplate;

    // Pass template type and and value to mutation
    mutate({ templateSetting, newValue });
  };

  return (
    <div className="min-h-screen flex flex-col gap-6 p-6">
      <h2 className="text-xl font-semibold">Settings</h2>

      <Tabs defaultValue="class" className="w-full">
        <TabsList>
          <TabsTrigger value="class" disabled={isPending}>
            Class Attendance Template
          </TabsTrigger>
          <TabsTrigger value="classAbsence" disabled={isPending}>
            Class Absence Template
          </TabsTrigger>
          <TabsTrigger value="schoolIn" disabled={isPending}>
            School In Template
          </TabsTrigger>
          <TabsTrigger value="schoolOut" disabled={isPending}>
            School Out Template
          </TabsTrigger>
        </TabsList>

        <TabsContent value="class">
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                This is content of the message sent to the parents when their
                child enters the class.
              </p>
              <Textarea
                rows={10}
                defaultValue={classAttendanceTemplate}
                onChange={(e) => setClassAttendanceTemplate(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={() => handleUpdate("class")}>
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Update Template"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="classAbsence">
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                This is content of the message sent to the parents when their
                child didn't attend their class.
              </p>
              <Textarea
                rows={10}
                defaultValue={classAbsenceTemplate}
                onChange={(e) => setClassAbsenceTemplate(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={() => handleUpdate("classAbsence")}>
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Update Template"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schoolIn">
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                This is content of the message sent to the parents when their
                child enters the school.
              </p>
              <Textarea
                rows={10}
                defaultValue={schoolInTemplate}
                onChange={(e) => setSchoolInTemplate(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={() => handleUpdate("schoolIn")}>
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Update Template"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schoolOut">
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                This is content of the message sent to the parents when their
                child exits the school.
              </p>
              <Textarea
                rows={10}
                defaultValue={schoolOutTemplate}
                onChange={(e) => setSchoolOutTemplate(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={() => handleUpdate("schoolOut")}>
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Update Template"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
