import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("erp-token", "dummy-token");
      toast({ title: "Welcome to Zentroverse ERP" });
      navigate("/");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      {/* Outer Glow Container */}
      <div className="relative w-full max-w-md rounded-2xl p-[2px] bg-gradient-to-br from-blue-500/40 via-cyan-400/40 to-blue-600/40 shadow-lg shadow-blue-900/40">
        {/* Inner Glass Card */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl p-8">
          {/* LOGO + TITLE */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="/logo.png"
              alt="Zentroverse Logo"
              className="h-20 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] hover:scale-105 transition-all"
            />
            <h1 className="mt-4 text-xl tracking-widest font-semibold text-blue-400 drop-shadow">
              ZENTROVERSE ERP
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Login to your account
          </h2>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              className="bg-white/10 text-white border-white/20 placeholder:text-gray-300"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              className="bg-white/10 text-white border-white/20 placeholder:text-gray-300"
              required
            />

            <Button className="w-full mt-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-4 text-center text-gray-300 text-sm">
            New user?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
