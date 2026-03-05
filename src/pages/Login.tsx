import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShoppingBag, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setname] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'login' | 'signup'>('login');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4001";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Email and password required" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast({ title: "Signed in", description: "Welcome back!" });
      // the API doesn't issue a real JWT yet, so we just store the user id as token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.user.id?.toString() || "");
      setStep('login');
      navigate("/");
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err.message || String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({ title: "Missing fields", description: "All fields required" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      toast({ title: "Account created", description: data.message || "Enter the OTP sent to your email." });
      setOtp("");
      setShowOtpModal(true);
    } catch (err: any) {
      toast({ title: "Sign up failed", description: err.message || String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mb-4">
              <ShoppingBag className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Welcome to ReMarket</h1>
            <p className="text-muted-foreground mt-1">Sign in to buy and sell pre-loved items</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <Tabs value={step} onValueChange={(v) => setStep(v as any)}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-9 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button disabled={loading} type="submit" className="w-full gradient-primary border-0 text-primary-foreground shadow-glow" size="lg">
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
                <Link to="/admin" className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    Admin Dashboard →
                  </Button>
                </Link>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label className="text-foreground">name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={name} onChange={(e) => setname(e.target.value)} placeholder="johndoe" className="pl-9" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-foreground">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-foreground">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="pl-9" />
                    </div>
                  </div>
                  <Button disabled={loading} type="submit" className="w-full gradient-primary border-0 text-primary-foreground shadow-glow" size="lg">
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>

      {/* OTP Verification Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit code to {email}. Enter it below to verify your account.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email || !otp) {
                toast({ title: "Missing fields", description: "Please enter the OTP" });
                return;
              }
              setLoading(true);
              try {
                const res = await fetch(`${API_BASE}/api/verify-otp`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, otp }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Verification failed');
                toast({ title: 'Email Verified!', description: 'You can now log in with your credentials.' });
                setShowOtpModal(false);
                setStep('login');
                setEmail("");
                setPassword("");
                setname("");
                setOtp("");
              } catch (err: any) {
                toast({ title: 'Verification Failed', description: err.message || String(err), variant: 'destructive' });
              } finally {
                setLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="otp-input" className="text-foreground">Enter OTP</Label>
              <Input
                id="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="mt-2 text-center text-2xl tracking-widest font-bold"
              />
            </div>
            <Button disabled={loading} type="submit" className="w-full gradient-primary border-0 text-primary-foreground shadow-glow" size="lg">
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;