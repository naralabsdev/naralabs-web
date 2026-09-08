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

export default function VerifiedAddressesPage() {
  return (
    <FeaturePage
      title="Verified Addresses"
      description="Verify ownership of addresses associated with your account."
      emptyTitle="No verified addresses yet"
      emptyDescription="Verified addresses will appear here once ownership is confirmed."
      actionLabel="Verify"
    />
  );
}
