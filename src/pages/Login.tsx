import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useLoginMutation } from "@/redux/services/authSlice";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/reducer/app.reducer";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const data = await login(values).unwrap();
      console.log(data);
      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? null,
          user: data.user,
        })
      );
      toast({ title: "Welcome to Zentroverse ERP" });
      navigate("/");
    } catch (err: any) {
      const message =
        err?.data?.message || err?.error || err?.message || "Login failed";
      toast({ title: "Login failed", description: message });
    }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email"
                    className="bg-white/10 text-white border-white/20 placeholder:text-gray-300"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400 ">{errors.email.message}</p>
                  )}
                </>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Password"
                    className="bg-white/10 text-white border-white/20 placeholder:text-gray-300"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400">{errors.password.message}</p>
                  )}
                </>
              )}
            />

            <Button className="w-full mt-2" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Logging in..." : "Login"}
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
