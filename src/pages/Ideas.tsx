import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lightbulb, Loader2, Sparkles, Copy } from "lucide-react";

type Idea = { title: string; hook: string; hashtags: string[] };

const Ideas = () => {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;
    setLoading(true);
    setIdeas([]);
    const { data, error } = await supabase.functions.invoke("ai-generate", {
      body: { type: "ideas", niche },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Generation failed", description: error.message, variant: "destructive" });
      return;
    }
    setIdeas(data?.ideas ?? []);
  };

  const copy = (idea: Idea) => {
    const text = `${idea.title}\n\n${idea.hook}\n\n${idea.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Lightbulb className="h-4 w-4 text-primary-glow" /> Idea Generator
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Spark your next <span className="gradient-text">viral video</span></h1>
        <p className="text-muted-foreground mt-2">Drop in a niche or topic. Get 6 high-CTR ideas with SEO titles & hashtags.</p>
      </div>

      <form onSubmit={generate} className="glass-card rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-3">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="niche" className="sr-only">Niche</Label>
          <Input
            id="niche"
            placeholder="e.g. AI productivity tips, vegan recipes, retro gaming..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="h-12 text-base"
          />
        </div>
        <Button type="submit" disabled={loading} className="gradient-brand text-primary-foreground border-0 h-12 px-6 glow-ring">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Generate
        </Button>
      </form>

      {loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 animate-pulse h-44" />
          ))}
        </div>
      )}

      {!loading && ideas.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {ideas.map((idea, i) => (
            <div key={i} className="glass-card rounded-xl p-6 flex flex-col">
              <h3 className="font-display font-semibold text-lg mb-2 leading-snug">{idea.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{idea.hook}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {idea.hashtags.map((h) => (
                  <span key={h} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-glow border border-primary/20">{h}</span>
                ))}
              </div>
              <Button size="sm" variant="outline" onClick={() => copy(idea)} className="self-start">
                <Copy className="h-3.5 w-3.5 mr-2" /> Copy
              </Button>
            </div>
          ))}
        </div>
      )}

      {!loading && ideas.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
          Your ideas will appear here.
        </div>
      )}
    </DashboardLayout>
  );
};

export default Ideas;
