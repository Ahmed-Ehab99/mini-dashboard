import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="from-primary to-primary-glow bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Professional admin interface
          </p>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />

            <div className="text-muted-foreground mt-6 text-center text-sm">
              <p>Demo credentials: any email and password will work</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
