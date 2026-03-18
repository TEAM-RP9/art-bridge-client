import { Badge, Paragraph, TagChip } from "@/components/ui";

type Ds6BadgeTagChipSectionsProps = {
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
};

export function Ds6BadgeTagChipSections({
  selectedTags,
  onRemoveTag,
}: Readonly<Ds6BadgeTagChipSectionsProps>) {
  return (
    <section id="ds6" className="space-y-8 scroll-mt-24">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Badge — variants</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Badge — sizes</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">TagChip — static</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <TagChip size="sm">Sketch</TagChip>
          <TagChip size="md">Acrylic</TagChip>
          <TagChip size="md">Commissioned</TagChip>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">TagChip — removable</h2>
        <Paragraph size="sm" color="muted" className="mt-2">
          Use the remove button to delete a tag from the selection.
        </Paragraph>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <TagChip
                key={tag}
                onRemove={() => onRemoveTag(tag)}
                removeLabel={`Remove ${tag} tag`}
              >
                {tag}
              </TagChip>
            ))
          ) : (
            <Paragraph size="sm" color="muted">
              No tags selected.
            </Paragraph>
          )}
        </div>
      </section>
    </section>
  );
}
