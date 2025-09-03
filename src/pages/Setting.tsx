import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="template" className="w-full">
        <TabsList>
          {/* <TabsTrigger value="account">Account Setting</TabsTrigger> */}
          <TabsTrigger value="template">Message Template</TabsTrigger>
          <TabsTrigger value="interface">Interface</TabsTrigger>
        </TabsList>

        {/* --- Account Setting Tab --- */}
        <TabsContent value="account">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Profile Upload */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload your photo
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="Please enter your full name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input placeholder="Please enter your email" />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input placeholder="Please enter your username" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input placeholder="+63 Please enter your phone number" />
                </div>
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea placeholder="Write your Bio here e.g your hobbies, interests ETC" />
              </div>

              <div className="flex gap-2">
                <Button>Update Profile</Button>
                <Button variant="outline">Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Message Template Tab --- */}
        <TabsContent value="template">
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                This is content of the message sent to the parents.
              </p>
              <Textarea
                rows={10}
                defaultValue={`Good day, {{parent_name}}!

We’re reaching out to inform you that your child, {{student_name}}, has successfully entered {{school_name}} today, {{date}}, at exactly {{entry_time}}.

This message is part of our ongoing effort to ensure transparency and your child's safety while on school grounds. If you have any concerns or questions, feel free to reach out to our administrative office.

Thank you for your continued support and trust in {{school_name}}.

Warm regards,
{{school_name}} Admin Team`}
              />
              <div className="flex gap-2">
                <Button>Update Template</Button>
                <Button variant="outline">Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Interface Tab --- */}
        <TabsContent value="interface">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                Interface customization settings go here...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
