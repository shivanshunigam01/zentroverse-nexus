import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  Banknote,
  Boxes,
  Cog,
  ChevronRight,
  ChevronDown,
  BarChart3,
} from "lucide-react";

export default function Reports() {
  const [openSection, setOpenSection] = useState("Income");
  const [filterType, setFilterType] = useState("Month");

  const toggleSection = (section: string) =>
    setOpenSection(openSection === section ? "" : section);

  // ----------- Demo Data -----------
  const incomeData = [
    { label: "Jan", JobCards: 65000, CounterSales: 35000 },
    { label: "Feb", JobCards: 78000, CounterSales: 42000 },
    { label: "Mar", JobCards: 92000, CounterSales: 38000 },
    { label: "Apr", JobCards: 88000, CounterSales: 45000 },
    { label: "May", JobCards: 105000, CounterSales: 52000 },
    { label: "Jun", JobCards: 125000, CounterSales: 48000 },
  ];

  const expenseData = [
    { label: "Purchases", Expense: 45000 },
    { label: "Salaries", Expense: 85000 },
    { label: "Rent", Expense: 35000 },
    { label: "Utilities", Expense: 15000 },
    { label: "Others", Expense: 20000 },
  ];

  const sidebarItems = [
    {
      title: "Income",
      icon: <Wallet className="h-4 w-4" />,
      children: [
        "By Make",
        "By Customer Type",
        "By Parts & Services",
        "By Type of Services",
        "By Type of Sale",
        "By Insurer",
        "Sales Register",
        "Collections",
      ],
    },
    {
      title: "Expenses",
      icon: <Banknote className="h-4 w-4" />,
      children: ["By Expense Type", "By Vendor", "Payments"],
    },
    {
      title: "Inventory",
      icon: <Boxes className="h-4 w-4" />,
      children: [
        "Stock By Parts",
        "Stock By Brand",
        "Stock By Vendor",
        "Purchase Orders",
        "Open Vs Closing Stock",
      ],
    },
    {
      title: "Operations",
      icon: <Cog className="h-4 w-4" />,
      children: [
        "Work In Progress",
        "By Status",
        "By Make",
        "Vehicle Report",
        "NPS Feedback",
        "Daily Summary",
      ],
    },
  ];

  return (
    <div className="flex gap-6">
      {/* ---------- Sidebar ---------- */}
      <aside className="w-64 bg-gradient-to-b from-green-700 to-emerald-800 text-white rounded-xl shadow-lg p-3">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <BarChart3 className="h-5 w-5" />
          Reports
        </h2>
        {sidebarItems.map((item) => (
          <div key={item.title} className="mb-2">
            <button
              onClick={() => toggleSection(item.title)}
              className="flex justify-between items-center w-full bg-green-800/60 hover:bg-green-700 transition rounded-md px-3 py-2"
            >
              <span className="flex items-center gap-2 font-medium">
                {item.icon}
                {item.title}
              </span>
              {openSection === item.title ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {openSection === item.title && (
              <div className="ml-7 mt-1 space-y-1 animate-fadeIn">
                {item.children.map((child) => (
                  <button
                    key={child}
                    className="block w-full text-left text-sm bg-green-900/40 hover:bg-green-700/80 px-2 py-1.5 rounded transition"
                  >
                    {child}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* ---------- Main Content ---------- */}
      <main className="flex-1 space-y-6">
        {/* Header + Filters */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Reports & Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Dynamic business insights with filters and demo data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 bg-card border">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Month">Month</SelectItem>
                <SelectItem value="Quarter">Quarter</SelectItem>
                <SelectItem value="Year">Year</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="date"
              className="border rounded-md px-2 py-1 text-sm bg-background text-foreground"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="income">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          {/* ---------- Income ---------- */}
          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={incomeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="JobCards" fill="#34d399" name="Job Cards" />
                    <Bar
                      dataKey="CounterSales"
                      fill="#059669"
                      name="Counter Sales"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- Expense ---------- */}
          <TabsContent value="expense">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Expense" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- Inventory ---------- */}
          <TabsContent value="inventory">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Inventory reports & analytics coming soon.
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- Operations ---------- */}
          <TabsContent value="operations">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Operational reports and metrics displayed here.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
