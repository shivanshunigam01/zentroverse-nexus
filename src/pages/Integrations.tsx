import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, MapPin, Package, Smartphone } from "lucide-react";
import { toast } from "sonner";

const integrations = [
  { 
    name: "Razorpay", 
    description: "Payment Gateway Integration", 
    icon: CreditCard, 
    status: "Connected",
    color: "text-primary"
  },
  { 
    name: "Location Solutions", 
    description: "GPS Tracking & Vehicle Location", 
    icon: MapPin, 
    status: "Not Connected",
    color: "text-success"
  },
  { 
    name: "StockOne", 
    description: "Spare Parts Inventory Management", 
    icon: Package, 
    status: "Connected",
    color: "text-warning"
  },
  { 
    name: "Tap NFC/QR", 
    description: "Customer Check-in System", 
    icon: Smartphone, 
    status: "Not Connected",
    color: "text-info"
  },
];

export default function Integrations() {
  const [integrationsList, setIntegrationsList] = useState(integrations);

  const handleToggle = (name: string) => {
    setIntegrationsList(integrationsList.map(int => 
      int.name === name 
        ? { ...int, status: int.status === "Connected" ? "Not Connected" : "Connected" }
        : int
    ));
    const integration = integrationsList.find(i => i.name === name);
    if (integration?.status === "Connected") {
      toast.error(`${name} disconnected`);
    } else {
      toast.success(`${name} connected successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect with external services</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {integrationsList.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.name} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-secondary ${integration.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">{integration.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                    </div>
                  </div>
                  <Badge variant={integration.status === "Connected" ? "default" : "outline"}>
                    {integration.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
              {integration.status === "Connected" ? (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => toast.info("Opening settings")}>
                    Settings
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleToggle(integration.name)}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button className="w-full" onClick={() => handleToggle(integration.name)}>
                  Connect
                </Button>
              )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
