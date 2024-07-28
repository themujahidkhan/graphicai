import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/types";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useGenerateGraphic } from "@/features/ai/api/use-generate-graphic";
import { useState } from "react";

interface GenerateGraphicAIProps {
  editor: Editor | undefined;
}

export const GenerateGraphicAI = ({ editor }: GenerateGraphicAIProps) => {
  const [prompt, setPrompt] = useState("");
  const mutation = useGenerateGraphic();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(
      { prompt },
      {
        onSuccess: ({ data }) => {
          try {
            editor?.loadJson(data);
            toast.success("Graphic generated successfully!");
          } catch (error) {
            console.error("Failed to load generated JSON:", error);
            toast.error("Failed to load generated graphic");
          }
        },
        onError: (error) => {
          console.error("Failed to generate graphic:", error);
          toast.error("Failed to generate graphic");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Generate the poster for our upcoming event called Movie Night"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        className="w-full"
        disabled={mutation.isPending}
      />
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full"
      >
        {mutation.isPending ? "Generating..." : "Generate Graphic"}
      </Button>
    </form>
  );
};