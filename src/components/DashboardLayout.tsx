import { Link, useLocation } from "react-router-dom";
import { Sparkles, LayoutDashboard, Lightbulb, FileText, LogOut, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/ideas", label: "Idea Generator", icon: Lightbulb },
  { to: "/dashboard/script", label: "Script Writer", icon: FileText },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border/60 bg-sidebar/60 backdrop-blur-xl px-4 py-6">
        <Link to="/" className="flex items-center gap-2 px-2 mb-8">
          <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center glow-ring">
            <Youtube className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">TubeForge</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-foreground border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Button variant="ghost" onClick={signOut} className="justify-start gap-3 text-muted-foreground">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/60">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display font-bold">TubeForge</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
        </header>
        <div className="px-4 md:px-10 py-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
