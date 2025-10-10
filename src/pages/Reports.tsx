import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Wallet,
  Banknote,
  Boxes,
  Cog,
  ChevronDown,
  ChevronRight,
  BarChart3,
} from "lucide-react";

export default function Reports() {
  const [openSection, setOpenSection] = useState("Income");
  const [selectedReport, setSelectedReport] = useState("Income Overview");

  const COLORS = ["#3b82f6", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

  // ---------- DEMO DATA BANK ----------
  const incomeData = [
    { month: "Jan", JobCards: 74000, CounterSales: 42000 },
    { month: "Feb", JobCards: 81000, CounterSales: 46000 },
    { month: "Mar", JobCards: 96000, CounterSales: 50000 },
    { month: "Apr", JobCards: 88000, CounterSales: 47000 },
    { month: "May", JobCards: 108000, CounterSales: 55000 },
    { month: "Jun", JobCards: 122000, CounterSales: 59000 },
  ];

  const expenseData = [
    { category: "Parts Purchase", amount: 65000 },
    { category: "Salaries", amount: 90000 },
    { category: "Rent & Utilities", amount: 42000 },
    { category: "Consumables", amount: 22000 },
    { category: "Miscellaneous", amount: 18000 },
  ];

  const inventoryData = [
    { item: "Brake Pad", brand: "Tata Genuine", qty: 42, value: 24000 },
    { item: "Oil Filter", brand: "Bosch", qty: 55, value: 19500 },
    { item: "Coolant", brand: "Castrol", qty: 25, value: 12500 },
    { item: "Tyre", brand: "MRF", qty: 12, value: 48000 },
  ];

  const operationsData = [
    { status: "Open Jobs", count: 36 },
    { status: "Completed Jobs", count: 212 },
    { status: "Pending Delivery", count: 8 },
    { status: "Warranty Claims", count: 11 },
  ];

  // ---------- SIDEBAR ----------
  const sidebarItems = [
    {
      title: "Income",
      icon: <Wallet className="h-4 w-4" />,
      reports: [
        "Income Overview",
        "By Make",
        "By Customer Type",
        "By Parts & Services",
        "Sales Register",
        "Collections",
      ],
    },
    {
      title: "Expenses",
      icon: <Banknote className="h-4 w-4" />,
      reports: ["Expense Overview", "By Expense Type", "By Vendor", "Payments"],
    },
    {
      title: "Inventory",
      icon: <Boxes className="h-4 w-4" />,
      reports: [
        "Stock By Parts",
        "Stock By Brand",
        "Purchase Orders",
        "Open Vs Closing Stock",
      ],
    },
    {
      title: "Operations",
      icon: <Cog className="h-4 w-4" />,
      reports: [
        "Work In Progress",
        "Vehicle Report",
        "NPS Feedback Report",
        "Daily Summary",
      ],
    },
  ];

  const toggleSection = (title: string) =>
    setOpenSection(openSection === title ? "" : title);

  // ---------- UNIVERSAL TABLE COMPONENT ----------
  const DataTable = ({
    columns,
    rows,
  }: {
    columns: string[];
    rows: (string | number)[][];
  }) => (
    <Card className="border border-slate-700 bg-slate-900 mt-6">
      <CardHeader>
        <CardTitle className="text-slate-100">Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col} className="text-slate-300">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                {r.map((v, j) => (
                  <TableCell key={j} className="text-slate-100">
                    {typeof v === "number" ? `₹${v.toLocaleString()}` : v}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // ---------- REPORT VIEW ----------
  const renderReport = () => {
    switch (true) {
      // Income
      case selectedReport.includes("Income"):
      case selectedReport.includes("By Make"):
      case selectedReport.includes("Customer"):
      case selectedReport.includes("Sales Register"):
      case selectedReport.includes("Collections"):
        return (
          <Card>
            <CardHeader>
              <CardTitle>{selectedReport}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      color: "white",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="JobCards" fill={COLORS[0]} name="Job Cards" />
                  <Bar
                    dataKey="CounterSales"
                    fill={COLORS[1]}
                    name="Counter Sales"
                  />
                </BarChart>
              </ResponsiveContainer>
              <DataTable
                columns={["Source", "Invoices", "Revenue"]}
                rows={[
                  ["Job Cards", 248, 740000],
                  ["Counter Sales", 190, 590000],
                  ["AMC / Warranty", 54, 160000],
                ]}
              />
            </CardContent>
          </Card>
        );

      // Expenses
      case selectedReport.includes("Expense"):
      case selectedReport.includes("Payments"):
      case selectedReport.includes("Vendor"):
        return (
          <Card>
            <CardHeader>
              <CardTitle>{selectedReport}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={120}
                    dataKey="amount"
                  >
                    {expenseData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <DataTable
                columns={["Head", "Vendor", "Amount"]}
                rows={[
                  ["Salaries", "-", 90000],
                  ["Parts Purchase", "Tata Genuine Parts", 65000],
                  ["Rent", "Sharma Properties", 25000],
                  ["Electricity", "Bihar Board", 17000],
                ]}
              />
            </CardContent>
          </Card>
        );

      // Inventory
      case selectedReport.includes("Stock"):
      case selectedReport.includes("Purchase"):
        return (
          <Card>
            <CardHeader>
              <CardTitle>{selectedReport}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="item" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      color: "white",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="qty"
                    stroke={COLORS[0]}
                    name="Quantity"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS[1]}
                    name="Value"
                  />
                </LineChart>
              </ResponsiveContainer>
              <DataTable
                columns={["Item", "Brand", "Qty", "Value"]}
                rows={inventoryData.map((d) => [
                  d.item,
                  d.brand,
                  d.qty,
                  d.value,
                ])}
              />
            </CardContent>
          </Card>
        );

      // Operations
      case selectedReport.includes("Work"):
      case selectedReport.includes("Vehicle"):
      case selectedReport.includes("Feedback"):
      case selectedReport.includes("Summary"):
        return (
          <Card>
            <CardHeader>
              <CardTitle>{selectedReport}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={operationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="status" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      color: "white",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill={COLORS[0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
              <DataTable
                columns={["Status", "Count"]}
                rows={operationsData.map((d) => [d.status, d.count])}
              />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="w-64 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-slate-100">
          <BarChart3 className="h-5 w-5 text-primary" />
          Reports
        </h2>
        {sidebarItems.map((item) => (
          <div key={item.title} className="mb-2">
            <button
              onClick={() => toggleSection(item.title)}
              className="flex justify-between items-center w-full hover:bg-slate-800 rounded-md px-3 py-2 transition"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                {item.icon}
                {item.title}
              </span>
              {openSection === item.title ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {openSection === item.title && (
              <div className="ml-7 mt-1 space-y-1 animate-fadeIn">
                {item.reports.map((rep) => (
                  <button
                    key={rep}
                    onClick={() => setSelectedReport(rep)}
                    className={`block w-full text-left text-sm px-2 py-1.5 rounded transition ${
                      selectedReport === rep
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                    }`}
                  >
                    {rep}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="flex-1 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            {selectedReport}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive insights for {selectedReport.toLowerCase()}.
          </p>
        </div>
        {renderReport()}
      </main>
    </div>
  );
}
