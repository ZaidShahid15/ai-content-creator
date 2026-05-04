import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Lightbulb, FileText, Video, Eye, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Videos created", value: "0", icon: Video },
  { label: "Total views", value: "0", icon: Eye },
  { label: "Ideas generated", value: "—", icon: Lightbulb },
  { label: "Scripts written", value: "—", icon: FileText },
];

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dashboard — TubeForge";
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) navigate("/auth", { replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) navigate("/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session?.user) return;
    supabase.from("profiles").select("display_name").eq("user_id", session.user.id).maybeSingle()
      .then(({ data }) => setName(data?.display_name || session.user.email?.split("@")[0] || ""));
  }, [session]);

  if (!session) return null;

  return (
    <DashboardLayout>
      <div className="mb-10">
        <p className="text-sm text-muted-foreground mb-1">Welcome back</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Hey {name} 👋</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon className="h-4 w-4 text-primary-glow" />
            </div>
            <div className="text-2xl font-display font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Link to="/dashboard/ideas" className="glass-card rounded-2xl p-7 hover:-translate-y-1 transition-transform group">
          <div className="h-11 w-11 rounded-xl gradient-brand flex items-center justify-center mb-5 glow-ring">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
            Generate viral ideas <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-muted-foreground">Type your niche and get 6 SEO-optimized titles, hooks and hashtag sets.</p>
        </Link>
        <Link to="/dashboard/script" className="glass-card rounded-2xl p-7 hover:-translate-y-1 transition-transform group">
          <div className="h-11 w-11 rounded-xl gradient-brand flex items-center justify-center mb-5 glow-ring">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
            Write a full script <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-muted-foreground">Hook, body and CTA tuned for retention with selectable tone.</p>
        </Link>
      </div>

      <div className="glass-card rounded-2xl p-7 mt-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold mb-1">Connect your YouTube channel</h3>
          <p className="text-sm text-muted-foreground">Coming soon — publish & schedule videos directly from TubeForge.</p>
        </div>
        <Button variant="outline" disabled>Soon</Button>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
