import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import JobCards from "./pages/JobCards";
import Estimation from "./pages/Estimation";
import CounterSales from "./pages/CounterSales";
import Inventory from "./pages/Inventory";
import PurchaseOrders from "./pages/PurchaseOrders";
import Vendors from "./pages/Vendors";
import Inward from "./pages/Inward";
import StockIssue from "./pages/StockIssue";
import StockTransfer from "./pages/StockTransfer";
import CRMReminders from "./pages/CRMReminders";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import CreditDebitNotes from "./pages/CreditDebitNotes";
import LoyaltySchemes from "./pages/LoyaltySchemes";
import Employees from "./pages/Employees";
import JobQueue from "./pages/JobQueue";
import WorkshopProfile from "./pages/WorkshopProfile";
import Integrations from "./pages/Integrations";
import Templates from "./pages/Templates";
import AssociatedWorkshops from "./pages/AssociatedWorkshops";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PurchaseReturns from "./pages/PurchaseReturns";
import StockAlerts from "./pages/StockAlerts";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="job-cards" element={<JobCards />} />
              <Route path="estimation" element={<Estimation />} />
              <Route path="counter-sales" element={<CounterSales />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="purchase-orders" element={<PurchaseOrders />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="inward" element={<Inward />} />
              <Route path="stock-issues" element={<StockIssue />} />
              <Route path="purchase-returns" element={<PurchaseReturns />} />
              <Route path="stock-alerts" element={<StockAlerts />} />
              <Route path="stock-transfer" element={<StockTransfer />} />
              <Route path="crm-reminders" element={<CRMReminders />} />
              <Route path="reports" element={<Reports />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="customers" element={<Customers />} />
              <Route path="credit-debit-notes" element={<CreditDebitNotes />} />
              <Route path="loyalty-schemes" element={<LoyaltySchemes />} />
              <Route path="employees" element={<Employees />} />
              <Route path="job-queue" element={<JobQueue />} />
              <Route path="workshop-profile" element={<WorkshopProfile />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="templates" element={<Templates />} />
              <Route
                path="associated-workshops"
                element={<AssociatedWorkshops />}
              />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
