import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Download, Filter } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const remindersData = [
  { customer: "Rajesh Kumar", regNo: "MH 01 AB 1234", serviceType: "Regular Service", dueDate: "2024-01-20", advisor: "Amit Shah", smsSent: true, emailSent: true },
  { customer: "Priya Sharma", regNo: "MH 02 CD 5678", serviceType: "Oil Change", dueDate: "2024-01-18", advisor: "Sneha Patel", smsSent: true, emailSent: false },
  { customer: "Amit Patel", regNo: "MH 03 EF 9012", serviceType: "Brake Service", dueDate: "2024-01-22", advisor: "Rahul Mehta", smsSent: false, emailSent: false },
  { customer: "Sneha Desai", regNo: "MH 04 GH 3456", serviceType: "Full Service", dueDate: "2024-01-25", advisor: "Amit Shah", smsSent: true, emailSent: true },
];

const statsData = [
  { title: "Reminders Sent", value: "156", color: "text-primary" },
  { title: "Due This Week", value: "42", color: "text-warning" },
  { title: "Overdue", value: "8", color: "text-destructive" },
  { title: "Completed", value: "134", color: "text-success" },
];

export default function CRMReminders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredReminders = remindersData.filter(reminder =>
    (reminder.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reminder.regNo.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === "all" || reminder.serviceType === typeFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">CRM Reminders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage service reminders for customers</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success("Sending batch reminders")}>
          <Send className="h-4 w-4" />
          Send Reminders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Regular Service">Regular Service</SelectItem>
                  <SelectItem value="Oil Change">Oil Change</SelectItem>
                  <SelectItem value="Brake Service">Brake Service</SelectItem>
                  <SelectItem value="Full Service">Full Service</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => toast.success("Exporting reminders")}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reg No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Advisor</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">SMS</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReminders.map((reminder, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">{reminder.customer}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{reminder.regNo}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{reminder.serviceType}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{reminder.dueDate}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{reminder.advisor}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={reminder.smsSent ? "default" : "outline"}>
                        {reminder.smsSent ? "Sent" : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={reminder.emailSent ? "default" : "outline"}>
                        {reminder.emailSent ? "Sent" : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="sm" onClick={() => toast.success("Reminder sent!")}>
                        <Send className="h-4 w-4" />
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
