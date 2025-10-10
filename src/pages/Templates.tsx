import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const templates = [
  { id: "T001", name: "Service Reminder SMS", type: "SMS", content: "Dear {customer}, your vehicle {vehicle} is due for service. Visit us at ZENTROVERSE." },
  { id: "T002", name: "Job Completion Email", type: "Email", content: "Hello {customer}, your vehicle {vehicle} service is complete. Thank you for choosing ZENTROVERSE." },
  { id: "T003", name: "Payment Reminder", type: "WhatsApp", content: "Hi {customer}, pending payment of {amount} for {jobcard}. Please clear at the earliest." },
];

export default function Templates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notification Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage communication templates</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success("Creating new template")}>
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Create Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input id="templateName" placeholder="e.g., Service Reminder" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateType">Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateContent">Template Content</Label>
              <Textarea 
                id="templateContent" 
                placeholder="Use {customer}, {vehicle}, {amount}, {jobcard} as placeholders"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Available variables: {"{customer}"}, {"{vehicle}"}, {"{amount}"}, {"{jobcard}"}
              </p>
            </div>
            <Button className="w-full" onClick={() => toast.success("Template saved!")}>
              Save Template
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Existing Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toast.info("Editing template")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toast.error("Template deleted")}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
