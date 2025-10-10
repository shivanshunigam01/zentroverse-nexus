import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [templatesList, setTemplatesList] = useState(templates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newTemplate = {
      id: `T${String(templatesList.length + 1).padStart(3, '0')}`,
      name: formData.get('templateName') as string,
      type: formData.get('templateType') as string,
      content: formData.get('templateContent') as string
    };
    setTemplatesList([...templatesList, newTemplate]);
    setIsDialogOpen(false);
    toast.success("Template saved successfully!");
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplatesList(templatesList.filter(t => t.id !== id));
    toast.success("Template deleted");
  };

  const handleSendTest = (template: any) => {
    toast.success(`Test ${template.type} sent: "${template.name}"`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notification Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage communication templates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Design a communication template</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input name="templateName" id="templateName" placeholder="e.g., Service Reminder" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateType">Type</Label>
                <Select name="templateType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateContent">Template Content</Label>
                <Textarea 
                  name="templateContent"
                  id="templateContent" 
                  placeholder="Use {customer}, {vehicle}, {amount}, {jobcard} as placeholders"
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {"{customer}"}, {"{vehicle}"}, {"{amount}"}, {"{jobcard}"}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Template</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Template Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Click "New Template" to create a communication template or edit existing ones from the list.</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Existing Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templatesList.map((template) => (
                <div key={template.id} className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleSendTest(template)}>
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toast.info("Editing template")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
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
