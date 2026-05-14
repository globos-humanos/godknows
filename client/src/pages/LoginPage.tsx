import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RecallPG</h1>
          <p className="text-slate-500 mt-2">Turn your NEET-PG PDFs into teaching, testing, and revision.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href='/dashboard'; }}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="mt-1 w-full p-2 border rounded-md" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" className="mt-1 w-full p-2 border rounded-md" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </div>
    </div>
  );
}
