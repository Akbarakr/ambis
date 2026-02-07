import { useState } from "react";
import { useAuth, useSendOtp, useVerifyOtp, useAdminLogin, useUpdateProfile } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ChefHat, GraduationCap, ArrowRight, Phone, Lock, Mail, User } from "lucide-react";

type Step = 'select' | 'student-mobile' | 'student-otp' | 'student-profile' | 'admin-login';

export default function Login() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("login");
  const [step, setStep] = useState<Step>('select');
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [adminStep, setAdminStep] = useState<'credentials' | 'otp'>('credentials');
  const [adminOtp, setAdminOtp] = useState("");

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const adminLogin = useAdminLogin();
  const updateProfile = useUpdateProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (user && step !== 'student-profile') {
    setLocation(user.role === 'admin' ? '/shop' : '/menu');
    return null;
  }

  const handleSendOtp = async () => {
    if (mobile.length < 10) {
      toast({ title: "Invalid Mobile", description: "Please enter a valid mobile number", variant: "destructive" });
      return;
    }
    try {
      const result = await sendOtp.mutateAsync(mobile);
      setDemoOtp(result.otp); // Demo only - remove in production
      toast({ title: "OTP Sent", description: `OTP sent to ${mobile}` });
      setStep('student-otp');
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "OTP must be 6 digits", variant: "destructive" });
      return;
    }
    try {
      const result = await verifyOtp.mutateAsync({ mobile, otp });
      if (result.needsProfileUpdate) {
        setStep('student-profile');
      } else {
        toast({ title: "Welcome back!", description: "Login successful" });
        setLocation('/menu');
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast({ title: "Name Required", description: "Please enter your name", variant: "destructive" });
      return;
    }
    try {
      await updateProfile.mutateAsync({ name, email: email || undefined });
      toast({ title: "Welcome!", description: "Profile updated successfully" });
      setLocation('/menu');
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleAdminLogin = async () => {
    if (!mobile || !password) {
      toast({ title: "Error", description: "Please enter mobile and password", variant: "destructive" });
      return;
    }
    try {
      const result = await adminLogin.mutateAsync({ mobile, password, otp: adminStep === 'otp' ? adminOtp : undefined });
      
      if (result.otpRequired) {
        setAdminStep('otp');
        setDemoOtp(result.otp);
        toast({ title: "OTP Sent", description: "Please enter the OTP sent to your mobile" });
      } else {
        toast({ title: "Welcome Admin!", description: "Login successful" });
        setLocation('/shop');
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-primary/20 hover:bg-primary/5 h-10 w-10"
          onClick={() => setStep('admin-login')}
        >
          <ChefHat className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-4 shadow-xl border-4 border-white">
            <img src="/assets/logo-transparent.png" alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="font-display font-bold text-4xl text-black">Ambi's Cafe</h1>
          <p className="text-muted-foreground mt-2 font-medium">Delicious food, delivered fast</p>
        </div>

        {step === 'select' && (
          <div className="grid gap-4">
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-primary/40 bg-white"
              onClick={() => setStep('student-mobile')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-black">Login</h3>
                  <p className="text-sm text-muted-foreground">Already registered? Login here</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary" />
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-orange-500/40 bg-white"
              onClick={() => setStep('student-profile')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <GraduationCap className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-black">Register</h3>
                  <p className="text-sm text-muted-foreground">New student? Sign up now</p>
                </div>
                <ArrowRight className="h-5 w-5 text-orange-600" />
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'student-mobile' && (
          <Card className="bg-white border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Student Login</CardTitle>
              <CardDescription>Enter your mobile number to receive OTP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-10 border-primary/20"
                  />
                </div>
              </div>
              <Button 
                className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-white" 
                onClick={handleSendOtp}
                disabled={sendOtp.isPending || mobile.length < 10}
              >
                {sendOtp.isPending ? "Sending..." : "Send OTP"}
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setStep('select')}>
                Back
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'student-otp' && (
          <Card className="bg-white border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Verify OTP</CardTitle>
              <CardDescription>Enter the 6-digit OTP sent to {mobile}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoOtp && (
                <div className="bg-yellow-100 p-3 rounded-lg text-sm border border-yellow-200">
                  <span className="font-bold text-yellow-800">Demo OTP:</span> {demoOtp}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10 text-center text-xl tracking-widest border-primary/20"
                    data-testid="input-otp"
                  />
                </div>
              </div>
              <Button 
                className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-white" 
                onClick={handleVerifyOtp}
                disabled={verifyOtp.isPending || otp.length !== 6}
                data-testid="button-verify-otp"
              >
                {verifyOtp.isPending ? "Verifying..." : "Verify & Login"}
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => { setStep('student-mobile'); setOtp(''); }}>
                Change Number
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'student-profile' && (
          <Card className="bg-white border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-2xl">New Registration</CardTitle>
              <CardDescription>Enter your details to create an account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-orange-500/20"
                    data-testid="input-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-mobile">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-10 border-orange-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email ID *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-orange-500/20"
                    data-testid="input-email"
                  />
                </div>
              </div>
              <Button 
                className="w-full h-12 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white" 
                onClick={async () => {
                  if (!mobile || mobile.length < 10) {
                    toast({ title: "Invalid Mobile", description: "10-digit mobile number is required", variant: "destructive" });
                    return;
                  }
                  if (!name.trim() || !email.trim()) {
                    toast({ title: "Required Fields", description: "Name and Email are required", variant: "destructive" });
                    return;
                  }
                  handleSendOtp();
                }}
                disabled={sendOtp.isPending || mobile.length < 10}
              >
                {sendOtp.isPending ? "Sending OTP..." : "Register & Send OTP"}
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setStep('select')}>
                Back
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'admin-login' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>
                {adminStep === 'credentials' ? "Enter your credentials" : `Enter the OTP sent to ${mobile}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminStep === 'credentials' ? (
                <>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    <span className="font-bold">Demo:</span> Mobile: 9999999999, Password: admin123
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-mobile">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-mobile"
                        type="tel"
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {demoOtp && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg text-sm">
                      <span className="font-bold">Demo OTP:</span> {demoOtp}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="admin-otp">OTP</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={adminOtp}
                        onChange={(e) => setAdminOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="pl-10 text-center text-xl tracking-widest"
                      />
                    </div>
                  </div>
                </>
              )}
              <Button 
                className="w-full" 
                onClick={handleAdminLogin}
                disabled={adminLogin.isPending}
              >
                {adminLogin.isPending ? "Processing..." : (adminStep === 'credentials' ? "Next" : "Verify & Login")}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => { 
                if (adminStep === 'otp') {
                  setAdminStep('credentials');
                } else {
                  setStep('select'); 
                  setMobile(''); 
                  setPassword(''); 
                }
              }}>
                Back
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
