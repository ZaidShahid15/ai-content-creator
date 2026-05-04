import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Lightbulb, FileText, Mic, Image as ImageIcon, BarChart3, Calendar, Youtube, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";
import { supabase } from "@/integrations/supabase/client";

const features = [
  { icon: Lightbulb, title: "Viral Idea Generator", desc: "Surface SEO-optimized titles, hooks and hashtags for any niche in seconds." },
  { icon: FileText, title: "AI Script Writer", desc: "Hook → body → CTA scripts with retention-focused pacing and tone control." },
  { icon: Mic, title: "Realistic Voiceovers", desc: "Pick a voice, accent and style. Turn scripts into studio-ready audio." },
  { icon: ImageIcon, title: "Thumbnail Studio", desc: "Generate high-CTR thumbnail concepts with bold text overlays." },
  { icon: Calendar, title: "Smart Scheduler", desc: "Plan a content calendar and auto-publish to YouTube." },
  { icon: BarChart3, title: "Growth Analytics", desc: "Track views, CTR and engagement across every uploaded video." },
];

const Index = () => {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    document.title = "TubeForge — AI YouTube Automation Platform";
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="container flex items-center justify-between py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center glow-ring">
            <Youtube className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">TubeForge</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          {authed ? (
            <Button asChild className="gradient-brand text-primary-foreground border-0">
              <Link to="/dashboard">Open dashboard <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/auth">Sign in</Link></Button>
              <Button asChild className="gradient-brand text-primary-foreground border-0 glow-ring">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="container relative pt-12 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-muted-foreground mb-8 animate-fade-up">
          <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
          AI-native YouTube automation
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05] animate-fade-up">
          Build a YouTube channel{" "}
          <span className="gradient-text">on autopilot</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up">
          Generate viral ideas, write scripts, produce voiceovers, design thumbnails, and schedule uploads — all from one AI-powered workspace.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 animate-fade-up">
          <Button size="lg" asChild className="gradient-brand text-primary-foreground border-0 glow-ring h-12 px-7 text-base">
            <Link to="/auth">Start creating free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-7 text-base">
            <a href="#features">See features</a>
          </Button>
        </div>

        <div className="mt-16 relative max-w-5xl mx-auto animate-fade-up">
          <div className="absolute inset-0 -m-4 rounded-3xl gradient-brand opacity-30 blur-3xl" aria-hidden />
          <img
            src={heroImg}
            alt="TubeForge AI YouTube automation dashboard preview"
            width={1536}
            height={1024}
            className="relative rounded-2xl border border-border/60 shadow-2xl"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to <span className="gradient-text">ship videos faster</span>
          </h2>
          <p className="mt-4 text-muted-foreground">From the first idea to the final upload — TubeForge handles the heavy lifting so you can focus on creativity.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <div className="h-11 w-11 rounded-xl gradient-brand flex items-center justify-center mb-5 glow-ring">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="container py-24">
        <div className="glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-brand opacity-10" aria-hidden />
          <h2 className="relative font-display text-4xl md:text-5xl font-bold tracking-tight">
            Ready to <span className="gradient-text">10x your channel?</span>
          </h2>
          <p className="relative mt-4 text-muted-foreground max-w-xl mx-auto">
            Free to start. Generate your first viral idea and full script in under a minute.
          </p>
          <ul className="relative mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {["No credit card", "Cancel anytime", "Cloud-synced workspace"].map((x) => (
              <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary-glow" /> {x}</li>
            ))}
          </ul>
          <div className="relative mt-10">
            <Button size="lg" asChild className="gradient-brand text-primary-foreground border-0 glow-ring h-12 px-8">
              <Link to="/auth">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="container py-10 text-sm text-muted-foreground flex justify-between border-t border-border/60">
        <span>© {new Date().getFullYear()} TubeForge</span>
        <span>Crafted with AI</span>
      </footer>
    </div>
  );
};

export default Index;
