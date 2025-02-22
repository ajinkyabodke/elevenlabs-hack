import { CalmingExercises } from "@/components/CalmingExercises";

export default function CalmPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Take a Moment</h1>
        <p className="text-lg text-muted-foreground">
          Explore breathing exercises and grounding techniques to help you find
          calm and clarity.
        </p>
      </div>
      <CalmingExercises />
    </div>
  );
}
