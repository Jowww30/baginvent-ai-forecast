import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { email, otp, type: "login" },
      });

      if (error || !data?.verified) {
        toast.error(data?.error || "Invalid or expired code");
        return;
      }

      toast.success("Verification successful!");
      // Store verification status in session
      sessionStorage.setItem("otp_verified", "true");
      sessionStorage.setItem("otp_verified_email", email);
      navigate("/");
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email, type: "login" },
      });

      if (error) {
        toast.error("Failed to resend code");
        return;
      }

      toast.success("New code sent to your email");
      setCountdown(60);
      setOtp("");
      
      // Show OTP in dev mode (remove in production)
      if (data?.otp) {
        console.log("Dev OTP:", data.otp);
        toast.info(`Dev mode: OTP is ${data.otp}`, { duration: 10000 });
      }
    } catch (err) {
      console.error("Resend error:", err);
      toast.error("Failed to resend code");
    } finally {
      setIsResending(false);
    }
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

          {/* Back Button */}
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Verify Your Email
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-medium text-foreground">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center mb-6">
            <InputOTP
              value={otp}
              onChange={setOtp}
              maxLength={6}
            >
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

          {/* Verify Button */}
          <Button
            variant="gradient"
            className="w-full mb-4"
            onClick={handleVerify}
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            {countdown > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend in {countdown}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-primary font-medium hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
