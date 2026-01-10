import { useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Calculator,
  ShoppingCart,
  Package,
  Users,
  Bell,
  ClipboardList,
  DollarSign,
  UserCircle,
  Settings,
  Menu,
  X,
  Search,
  ChevronDown,
  LogOut,
  Building2,
  Truck,
  Boxes,
  GitBranch,
  CalendarClock,
  Briefcase,
  ClipboardCheck,
  StickyNote,
  Plug,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/redux/services/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetAuth } from "@/redux/reducer/app.reducer";
//test
const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Job Cards", href: "/job-cards", icon: FileText },
  { name: "Estimation", href: "/estimation", icon: Calculator },
  { name: "Counter Sales", href: "/counter-sales", icon: ShoppingCart },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    subItems: [
      { name: "Stock", href: "/inventory" },
      { name: "Purchase Orders", href: "/purchase-orders" },
      { name: "Inward", href: "/inward" },
      { name: "Stock Issues", href: "/stock-issues" },
      { name: "Purchase Returns", href: "/purchase-returns" },
      {
        name: "Stock Alerts",
        href: "/stock-alerts",
      },
      { name: "Stock Transfer", href: "/stock-transfer" },
    ],
  },
  { name: "Vendors", href: "/vendors", icon: Truck },
  { name: "CRM Reminders", href: "/crm-reminders", icon: Bell },
  { name: "Reports", href: "/reports", icon: ClipboardList },
  {
    name: "Finance",
    href: "/transactions",
    icon: DollarSign,
    subItems: [
      { name: "Transactions", href: "/transactions" },
      { name: "Credit/Debit Notes", href: "/credit-debit-notes" },
    ],
  },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Loyalty Schemes", href: "/loyalty-schemes", icon: StickyNote },
  {
    name: "HR",
    href: "/employees",
    icon: UserCircle,
    subItems: [
      { name: "Employees", href: "/employees" },
      { name: "Job Queue", href: "/job-queue" },
    ],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    subItems: [
      { name: "Workshop Profile", href: "/workshop-profile" },
      { name: "Integrations", href: "/integrations" },
      { name: "Templates", href: "/templates" },
      { name: "Associated Workshops", href: "/associated-workshops" },
      { name: "Settings", href: "/settings" },
    ],
  },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const isParentActive = (item: any) => {
    if (!item.subItems) return false;
    return item.subItems.some((sub: any) => location.pathname === sub.href);
  };
  const [logout] = useLogoutMutation();
  const app = useSelector((state: any) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout({ refreshToken: app.refreshToken }).unwrap();
      dispatch(resetAuth());
      navigate("/login");
      // Handle successful logout (e.g., redirect to login page)
    } catch (error) {
      // Handle logout error
    }
  };

  return (
    <div className="dark min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
          <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 border-b border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-cyan-400/10 hover:from-blue-500/30 hover:to-cyan-400/20 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Zentroverse Logo"
                className="h-20 w-auto object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h1 className="mt-3 text-sm tracking-widest font-semibold text-slate-300 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              ERP
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      {!item.subItems ? (
                        <Link
                          to={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      ) : (
                        <div>
                          <button
                            onClick={() => toggleExpanded(item.name)}
                            className={`group flex w-full items-center justify-between gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors ${
                              isParentActive(item)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <item.icon className="h-5 w-5 shrink-0" />
                              {item.name}
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedItems.includes(item.name)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedItems.includes(item.name) && (
                            <ul className="mt-1 space-y-1 pl-9">
                              {item.subItems.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    to={subItem.href}
                                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                                      isActive(subItem.href)
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <X className="h-6 w-6 text-foreground" />
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <Building2 className="h-8 w-8 text-primary" />
                  <span className="ml-2 text-xl font-bold text-foreground">
                    ZENTROVERSE
                  </span>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 ${
                                isActive(item.href)
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                              }`}
                            >
                              <item.icon className="h-5 w-5 shrink-0" />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-foreground lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground pl-3" />
              <Input
                type="search"
                placeholder="Search..."
                className="h-full w-full border-0 bg-transparent pl-10 text-foreground focus:ring-0 sm:text-sm"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-white" />
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-x-2">
                    <UserCircle className="h-6 w-6 text-white" />
                    <span className="hidden lg:flex lg:items-center text-white">
                      <span className="text-sm font-medium">{app.user?.name}</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
