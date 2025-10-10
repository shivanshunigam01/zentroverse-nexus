import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import { toast } from "sonner";

const workshops = [
  { id: "WS-001", name: "ZENTROVERSE Main - Mumbai", businessType: "Multi-Brand", createdDate: "2023-01-15", package: "Professional", gstin: "27AABCU9603R1ZV" },
  { id: "WS-002", name: "ZENTROVERSE Branch - Pune", businessType: "Multi-Brand", createdDate: "2023-06-20", package: "Standard", gstin: "27AABCU9603R1ZW" },
  { id: "WS-003", name: "ZENTROVERSE Express - Thane", businessType: "Quick Service", createdDate: "2023-09-10", package: "Basic", gstin: "27AABCU9603R1ZX" },
];

export default function AssociatedWorkshops() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Associated Workshops</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage multiple workshop locations</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success("Adding new workshop")}>
          <Plus className="h-4 w-4" />
          Add Workshop
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Workshop Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Workshop ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Business Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Package</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">GSTIN</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map((workshop) => (
                  <tr key={workshop.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{workshop.id}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{workshop.name}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{workshop.businessType}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{workshop.createdDate}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={workshop.package === "Professional" ? "default" : "secondary"}>
                        {workshop.package}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{workshop.gstin}</td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="icon" onClick={() => toast.info("Viewing workshop details")}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
