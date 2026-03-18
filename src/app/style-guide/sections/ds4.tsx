import { Code, Heading, Label, Paragraph } from "@/components/ui";

export function Ds4TypographySections() {
  return (
    <section id="ds4" className="space-y-8 scroll-mt-24">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Heading — levels</h2>
        <div className="mt-4 space-y-4">
          <Heading level="h1">Heading H1 — Large Page Title</Heading>
          <Heading level="h2">Heading H2 — Section Title</Heading>
          <Heading level="h3">Heading H3 — Subsection Title</Heading>
          <Heading level="h4">Heading H4 — Small Title</Heading>
          <Heading level="h5">Heading H5 — Minor Title</Heading>
          <Heading level="h6">Heading H6 — Smallest Title</Heading>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Heading — colors</h2>
        <div className="mt-4 space-y-3">
          <Heading level="h3" color="default">Default color heading</Heading>
          <Heading level="h3" color="muted">Muted color heading</Heading>
          <Heading level="h3" color="accent">Accent color heading</Heading>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Paragraph — sizes & variants</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="para-lg">Large (base text):</Label>
            <Paragraph size="lg" className="mt-2">
              This is a large paragraph with comfortable reading line-height. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </Paragraph>
          </div>
          <div>
            <Label htmlFor="para-base">Base (default):</Label>
            <Paragraph size="base" className="mt-2">
              This is base paragraph text, the standard size for body content across the design system.
            </Paragraph>
          </div>
          <div>
            <Label htmlFor="para-sm">Small:</Label>
            <Paragraph size="sm" className="mt-2">
              Small paragraph text ideal for secondary information or captions.
            </Paragraph>
          </div>
          <div>
            <Label htmlFor="para-xs">Extra small:</Label>
            <Paragraph size="xs" className="mt-2">
              Extra small text for minor details or disclaimers.
            </Paragraph>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Paragraph — weights & colors</h2>
        <div className="mt-4 space-y-3">
          <Paragraph weight="normal">Normal weight paragraph text.</Paragraph>
          <Paragraph weight="medium">Medium weight paragraph text.</Paragraph>
          <Paragraph weight="semibold">Semibold weight paragraph text.</Paragraph>
          <Paragraph color="muted">Muted color paragraph text.</Paragraph>
          <Paragraph color="accent">Accent color paragraph text.</Paragraph>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Label — variations</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="regular">Regular label</Label>
            <input id="regular" type="text" className="mt-2 w-full rounded border border-input px-3 py-2" placeholder="Input..." />
          </div>
          <div>
            <Label htmlFor="required" required>Required label</Label>
            <input id="required" type="text" className="mt-2 w-full rounded border border-input px-3 py-2" placeholder="Input..." />
          </div>
          <div>
            <Label htmlFor="disabled" disabled>Disabled label</Label>
            <input id="disabled" type="text" className="mt-2 w-full cursor-not-allowed rounded border border-input px-3 py-2 text-muted-foreground opacity-50" placeholder="Disabled..." disabled />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Code — inline & block</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Paragraph className="mb-2">Inline code example:</Paragraph>
            <Paragraph>Use <Code>const name = &quot;ArtBridge&quot;;</Code> to define a variable.</Paragraph>
          </div>
          <div>
            <Paragraph className="mb-2">Block code example:</Paragraph>
            <Code variant="block">{`function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}`}</Code>
          </div>
        </div>
      </section>
    </section>
  );
}
