import {
  CardSkeleton,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ProgressCard,
  ProgressCardSkeleton,
  StatCard,
  StatCardSkeleton,
} from "@/components/ui";

export function Ds7CardSections() {
  return (
    <section id="ds7" className="space-y-8 scroll-mt-24">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Card — base primitives</h2>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Portfolio Insights</CardTitle>
              <CardDescription>
                Weekly snapshot of your gallery performance.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep cards composable with header/content/footer primitives.
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-xs text-muted-foreground">Updated 2h ago</span>
          </CardFooter>
        </Card>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">StatCard — metrics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Profile views"
            value="12,480"
            trend="up"
            trendLabel="+12.4%"
            description="Compared to last week"
          />
          <StatCard
            title="Inquiries"
            value="87"
            trend="down"
            trendLabel="-2.1%"
            description="Compared to last week"
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">ProgressCard — completion</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ProgressCard
            title="Portfolio completion"
            value={72}
            tone="default"
            description="Add 3 more projects to reach 100%."
          />
          <ProgressCard
            title="Verification"
            value={95}
            tone="success"
            valueLabel="95%"
            description="Almost done, one final step left."
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Skeleton — loading states</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <CardSkeleton />
          <div className="space-y-4">
            <StatCardSkeleton />
            <ProgressCardSkeleton />
          </div>
        </div>
      </section>
    </section>
  );
}
