import { TimeCapsule } from "@/components/TimeCapsule";

export default function TimeCapsulePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Time Capsule</h1>
        <p className="text-lg text-muted-foreground">
          Connect with your past and future self through meaningful reflections
        </p>
      </div>

      <TimeCapsule />
    </div>
  );
}
