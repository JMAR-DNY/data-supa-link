
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Apple, Facebook, LucideIcon } from "lucide-react";

interface AuthFormProps {
  setIsLoading: (loading: boolean) => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

type FormData = z.infer<typeof loginSchema>;

export default function AuthForm({ setIsLoading }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, signInWithSocial } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(data.email, data.password);
        if (error) throw error;
      } else {
        const { error } = await signUp(data.email, data.password);
        if (error) throw error;
        else {
          toast({
            title: "Account created",
            description: "Please check your email to confirm your account.",
          });
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication error",
        description: error.message || "Failed to authenticate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    setIsLoading(true);
    try {
      const { error } = await signInWithSocial(provider);
      if (error) throw error;
    } catch (error: any) {
      console.error(`${provider} authentication error:`, error);
      toast({
        title: "Authentication error",
        description: error.message || `Failed to authenticate with ${provider}`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      {/* Social login section hidden as requested */}
      {/* 
      <div className="flex items-center justify-center">
        <Separator className="w-1/3" />
        <span className="px-3 text-xs text-muted-foreground whitespace-nowrap">OR CONTINUE WITH</span>
        <Separator className="w-1/3" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => handleSocialLogin("google")}
          className="w-full flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-google">
            <circle cx="12" cy="12" r="10"/>
            <path d="M21.64 12.24c0-.78-.07-1.53-.2-2.25H12v4.26h5.42c-.23 1.27-.94 2.34-2 3.06v2.54h3.23c1.9-1.74 3-4.3 3-7.34z" fill="#4285F4" stroke="none"/>
            <path d="M12 21c2.7 0 4.97-.89 6.64-2.39l-3.23-2.54c-.89.6-2.04.95-3.41.95-2.63 0-4.85-1.77-5.64-4.15H3.06v2.63C4.72 18.65 8.09 21 12 21z" fill="#34A853" stroke="none"/>
            <path d="M6.36 12.87c-.2-.6-.31-1.24-.31-1.89s.11-1.29.31-1.89V6.46H3.06C2.38 8.15 2 10.02 2 12s.38 3.85 1.06 5.54l3.3-2.67z" fill="#FBBC05" stroke="none"/>
            <path d="M12 5.96c1.48 0 2.81.51 3.85 1.51l2.84-2.85C16.96 2.99 14.7 2 12 2 8.09 2 4.72 4.35 3.06 7.46l3.3 2.67c.79-2.38 3.01-4.17 5.64-4.17z" fill="#EA4335" stroke="none"/>
          </svg>
          <span>Google</span>
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => handleSocialLogin("facebook")}
          className="w-full flex items-center justify-center gap-2"
        >
          <Facebook size={16} color="#1877F2" />
          <span>Facebook</span>
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => handleSocialLogin("apple")}
          className="w-full flex items-center justify-center gap-2"
        >
          <Apple size={16} />
          <span>Apple</span>
        </Button>
      </div>
      */}

      <div className="mt-4 text-center text-sm">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
