import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FileText, Loader2, Sparkles, Copy } from "lucide-react";

const Script = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<"educational" | "viral" | "storytelling">("viral");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState("");

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setScript("");
    const { data, error } = await supabase.functions.invoke("ai-generate", {
      body: { type: "script", topic, tone },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Generation failed", description: error.message, variant: "destructive" });
      return;
    }
    setScript(data?.script ?? "");
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <FileText className="h-4 w-4 text-primary-glow" /> Script Writer
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Write a <span className="gradient-text">retention-ready script</span></h1>
        <p className="text-muted-foreground mt-2">Hook → Body → CTA. Pick the tone and get a polished YouTube script.</p>
      </div>

      <form onSubmit={generate} className="glass-card rounded-2xl p-6 mb-8 grid md:grid-cols-[1fr_180px_auto] gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="topic" className="sr-only">Topic</Label>
          <Input
            id="topic"
            placeholder="What's the video about?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-12 text-base"
          />
        </div>
        <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
          <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="viral">Viral / Entertainment</SelectItem>
            <SelectItem value="educational">Educational</SelectItem>
            <SelectItem value="storytelling">Storytelling</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={loading} className="gradient-brand text-primary-foreground border-0 h-12 px-6 glow-ring">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Generate
        </Button>
      </form>

      {loading && (
        <div className="glass-card rounded-2xl p-6 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-muted animate-pulse" style={{ width: `${60 + (i * 7) % 40}%` }} />
          ))}
        </div>
      )}

      {!loading && script && (
        <div className="glass-card rounded-2xl p-7 relative">
          <Button
            size="sm" variant="outline"
            className="absolute top-4 right-4"
            onClick={() => { navigator.clipboard.writeText(script); toast({ title: "Script copied" }); }}
          >
            <Copy className="h-3.5 w-3.5 mr-2" /> Copy
          </Button>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">{script}</pre>
        </div>
      )}

      {!loading && !script && (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
          Your script will appear here.
        </div>
      )}
    </DashboardLayout>
  );
};

export default Script;
