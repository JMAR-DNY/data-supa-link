
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

      <div className="flex items-center">
        <Separator className="flex-grow" />
        <span className="px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
        <Separator className="flex-grow" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => handleSocialLogin("google")}
          className="w-full"
        >
          Google
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => handleSocialLogin("facebook")}
          className="w-full"
        >
          Facebook
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => handleSocialLogin("apple")}
          className="w-full"
        >
          Apple
        </Button>
      </div>

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
