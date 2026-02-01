import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-slate-900 font-display">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            The page you requested does not exist. Please check the URL and try again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
