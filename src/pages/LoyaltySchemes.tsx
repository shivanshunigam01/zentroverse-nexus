import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";

const packages = [
  { id: "PKG-001", name: "Gold Service Package", type: "Loyalty", fromDate: "2024-01-01", toDate: "2024-12-31", description: "Annual service package" },
  { id: "PKG-002", name: "Extended Warranty 3Y", type: "Warranty", fromDate: "2024-01-01", toDate: "2027-01-01", description: "3-year extended warranty" },
];

const customerSchemes = [
  { customer: "Rajesh Kumar", vehicle: "MH 01 AB 1234", offer: "Gold Service Package", validity: "2024-12-31", dealer: "Main Workshop", commission: "₹5,000", status: "Active" },
  { customer: "Priya Sharma", vehicle: "MH 02 CD 5678", offer: "Extended Warranty 3Y", validity: "2027-01-01", dealer: "Main Workshop", commission: "₹8,000", status: "Active" },
];

export default function LoyaltySchemes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Loyalty Schemes & Extended Warranty</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage customer loyalty programs</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success("Creating new package")}>
          <Plus className="h-4 w-4" />
          New Package
        </Button>
      </div>

      <Tabs defaultValue="packages">
        <TabsList>
          <TabsTrigger value="packages">Manage Packages</TabsTrigger>
          <TabsTrigger value="customers">Manage Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Available Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Package ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">From Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">To Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{pkg.id}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{pkg.name}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge variant={pkg.type === "Loyalty" ? "default" : "secondary"}>{pkg.type}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{pkg.fromDate}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{pkg.toDate}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{pkg.description}</td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="icon" onClick={() => toast.info("Editing package")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Customer Schemes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Offer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Validity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Dealer</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Commission</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerSchemes.map((scheme, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground">{scheme.customer}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{scheme.vehicle}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{scheme.offer}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{scheme.validity}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{scheme.dealer}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">{scheme.commission}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge variant="default">{scheme.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
