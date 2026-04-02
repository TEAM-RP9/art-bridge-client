import { FormField, Input, Paragraph, Switch, Textarea } from "../../../components/ui";

type Ds5FormControlSectionsProps = {
  notificationsEnabled: boolean;
  onNotificationsChange: (checked: boolean) => void;
};

export function Ds5FormControlSections({
  notificationsEnabled,
  onNotificationsChange,
}: Readonly<Ds5FormControlSectionsProps>) {
  return (
    <section id="ds5" className="space-y-8 scroll-mt-24">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Input — states & sizes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input placeholder="Default input" />
          <Input state="success" placeholder="Success input" />
          <Input state="error" placeholder="Error input" aria-invalid />
          <Input size="lg" placeholder="Large input" />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Textarea — states & resize</h2>
        <div className="mt-4 grid gap-4">
          <Textarea placeholder="Vertical resize (default)" />
          <Textarea resize="none" placeholder="Resize disabled" />
          <Textarea state="error" placeholder="Textarea with error state" aria-invalid />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Switch — interactive</h2>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={onNotificationsChange}
              aria-label="Enable notifications"
            />
            <Paragraph size="sm">
              Notifications {notificationsEnabled ? "enabled" : "disabled"}
            </Paragraph>
          </div>

          <div className="flex items-center gap-3">
            <Switch size="sm" aria-label="Small switch demo" />
            <Paragraph size="sm" color="muted">
              Small size switch
            </Paragraph>
          </div>

          <div className="flex items-center gap-3">
            <Switch state="error" aria-label="Error state switch demo" />
            <Paragraph size="sm" className="text-destructive">
              Error state
            </Paragraph>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">FormField — composition</h2>
        <div className="mt-4 grid gap-5">
          <FormField
            label="Artwork title"
            htmlFor="artwork-title"
            required
            description="Keep title concise and specific."
          >
            <Input id="artwork-title" placeholder="Moonlight Over Tallinn" />
          </FormField>

          <FormField
            label="Artwork description"
            htmlFor="artwork-description"
            description="Describe medium, concept, and dimensions."
          >
            <Textarea id="artwork-description" placeholder="Describe your artwork..." />
          </FormField>

          <FormField
            label="Artist statement"
            htmlFor="artist-statement"
            error="Statement is required and must be at least 50 characters."
          >
            <Textarea
              id="artist-statement"
              state="error"
              aria-invalid
              placeholder="Write your statement..."
            />
          </FormField>
        </div>
      </section>
    </section>
  );
}
