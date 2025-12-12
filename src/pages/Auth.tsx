import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Mail, Lock, Eye, EyeOff, Phone, ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailAuthSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72, "Password too long"),
});

const phoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Enter phone in format: +1234567890"),
});

type AuthMethod = "email-password" | "email-otp" | "phone-otp";
type AuthStep = "input" | "verify";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email-password");
  const [authStep, setAuthStep] = useState<AuthStep>("input");
  
  // Email/Password fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone field
  const [phone, setPhone] = useState("");
  
  // OTP field
  const [otp, setOtp] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string }>({});
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateEmailPassword = () => {
    const result = emailAuthSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateEmail = () => {
    const result = z.string().trim().email("Invalid email address").max(255).safeParse(email);
    if (!result.success) {
      setErrors({ email: "Invalid email address" });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePhone = () => {
    const result = phoneSchema.safeParse({ phone });
    if (!result.success) {
      setErrors({ phone: result.error.errors[0].message });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailPassword()) return;
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Logged in successfully!");
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please login instead.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created! You can now login.");
          setIsLogin(true);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailOTPRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: !isLogin,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email for the verification code!");
        setAuthStep("verify");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneOTPRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: !isLogin,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your phone for the verification code!");
        setAuthStep("verify");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setIsSubmitting(true);

    try {
      const verifyPayload = authMethod === "email-otp" 
        ? { email, token: otp, type: "email" as const }
        : { phone, token: otp, type: "sms" as const };

      const { error } = await supabase.auth.verifyOtp(verifyPayload);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Verified successfully!");
        navigate("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setPhone("");
    setOtp("");
    setErrors({});
    setAuthStep("input");
  };

  const switchAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="chart-card p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">BAG-INVENT</h1>
                <p className="text-xs text-muted-foreground">Inventory AI</p>
              </div>
            </div>
          </div>

          {/* Back button for OTP verification step */}
          {authStep === "verify" && (
            <button
              type="button"
              onClick={() => setAuthStep("input")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {authStep === "verify" 
                ? "Enter Verification Code" 
                : isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {authStep === "verify" 
                ? `Code sent to ${authMethod === "email-otp" ? email : phone}`
                : isLogin ? "Sign in to your account" : "Sign up for a new account"}
            </p>
          </div>

          {/* OTP Verification Form */}
          {authStep === "verify" ? (
            <form onSubmit={handleOTPVerify} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isSubmitting || otp.length !== 6}
              >
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={() => {
                    if (authMethod === "email-otp") {
                      handleEmailOTPRequest({ preventDefault: () => {} } as React.FormEvent);
                    } else {
                      handlePhoneOTPRequest({ preventDefault: () => {} } as React.FormEvent);
                    }
                  }}
                  className="text-primary font-medium hover:underline"
                  disabled={isSubmitting}
                >
                  Resend
                </button>
              </p>
            </form>
          ) : (
            <>
              {/* Auth Method Tabs */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6">
                <button
                  type="button"
                  onClick={() => switchAuthMethod("email-password")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    authMethod === "email-password" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => switchAuthMethod("email-otp")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    authMethod === "email-otp" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Email OTP
                </button>
                <button
                  type="button"
                  onClick={() => switchAuthMethod("phone-otp")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    authMethod === "phone-otp" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Phone OTP
                </button>
              </div>

              {/* Email + Password Form */}
              {authMethod === "email-password" && (
                <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
                  </Button>
                </form>
              )}

              {/* Email OTP Form */}
              {authMethod === "email-otp" && (
                <form onSubmit={handleEmailOTPRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-otp">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-otp"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending code..." : "Send Verification Code"}
                  </Button>
                </form>
              )}

              {/* Phone OTP Form */}
              {authMethod === "phone-otp" && (
                <form onSubmit={handlePhoneOTPRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1234567890"
                        className="pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    <p className="text-xs text-muted-foreground">
                      Enter phone with country code (e.g., +1 for US)
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending code..." : "Send Verification Code"}
                  </Button>
                </form>
              )}

              {/* Toggle Login/Signup */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
