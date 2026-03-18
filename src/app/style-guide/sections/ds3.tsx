import { Button } from "@/components/ui";

export function Ds3ButtonSections() {
  return (
    <section id="ds3" className="space-y-8 scroll-mt-24">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Button — variants</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Button — sizes</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Button — states</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Outline disabled
          </Button>
        </div>
      </section>
    </section>
  );
}
