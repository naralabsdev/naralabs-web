import { DASHBOARD_USAGE_LIMITS } from "@/app/(site)/dashboard/constants";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { Button } from "@/shared/ui/button";

export default function ApiDashboardPage() {
  return (
    <>
      <DetailSectionCard
        title="My API Keys"
        description={`For higher rate limits and additional endpoints, contact us to upgrade your API plan. Each account is limited to ${DASHBOARD_USAGE_LIMITS.apiKeys} API keys.`}
        flushContent
        action={
          <Button
            type="button"
            text="+ Add"
            className="h-9 rounded-lg px-4"
            disabled
          />
        }
      >
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:px-8 sm:py-14">
          <p className="text-sm font-medium text-neutral-900">No API keys found</p>
          <p className="mt-2 max-w-md text-sm text-neutral-500">
            Create an API key to start using the Naralabs Atlas API.
          </p>
        </div>
      </DetailSectionCard>

      <DetailSectionCard
        title="API Documentation"
        description='Source attribution via a link back or mention that your app is "Powered by Naralabs APIs" is required except for personal/private usage.'
      >
        <p className="text-sm text-neutral-500">
          API key management and usage analytics will appear here once enabled for
          your account.
        </p>
      </DetailSectionCard>
    </>
  );
}
