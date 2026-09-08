import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { Button } from "@/shared/ui/button";

function FeaturePage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  actionLabel = "Add",
}: {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  actionLabel?: string;
}) {
  return (
    <DetailSectionCard
      title={title}
      description={description}
      flushContent
      action={
        <Button
          type="button"
          text={actionLabel}
          className="h-9 rounded-lg px-4"
          disabled
        />
      }
    >
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:px-8 sm:py-14">
        <p className="text-sm font-medium text-neutral-900">{emptyTitle}</p>
        <p className="mt-2 max-w-md text-sm text-neutral-500">{emptyDescription}</p>
      </div>
    </DetailSectionCard>
  );
}

export default function PrivateNameTagsPage() {
  return (
    <FeaturePage
      title="Private Name Tags"
      description="Private name tags (up to 35 characters) can be used for easy identification of addresses."
      emptyTitle="No private name tags yet"
      emptyDescription="Attach a private label to any address for easier tracking in your account."
    />
  );
}
