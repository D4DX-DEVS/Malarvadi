import { Container } from "@/components/ui";
import { Float, Star, StarBuddy } from "@/components/Decor";

/** Playful language-neutral loader: three bouncing garden dots + star buddy. */
export default function Loading() {
  return (
    <Container className="py-16">
      <div className="animate-pop-in relative flex flex-col items-center gap-5 overflow-hidden rounded-cardLg bg-white p-10 shadow-playful" role="status" aria-label="Loading">
        <Float className="absolute -left-2 top-4" animation="animate-twinkle">
          <Star className="h-6 w-6 text-marigold/50" />
        </Float>
        <Float className="absolute -right-1 bottom-6" animation="animate-twinkle" delay="1s">
          <Star className="h-4 w-4 text-teal/50" />
        </Float>
        <StarBuddy className="h-12 w-12 animate-float text-marigold" />
        <div className="flex items-center gap-2.5" aria-hidden="true">
          <span className="h-3.5 w-3.5 rounded-full bg-leaf animate-bounce-soft" />
          <span className="h-3.5 w-3.5 rounded-full bg-marigold animate-bounce-soft" style={{ animationDelay: "0.15s" }} />
          <span className="h-3.5 w-3.5 rounded-full bg-plum animate-bounce-soft" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </Container>
  );
}
