import { getEmailDisplayName } from "@/modules/auth/lib/auth-user";
import { getAuthSession } from "@/modules/auth/lib/session.server";
import { DETAIL_ROW_CLASS } from "@/app/(site)/dashboard/constants";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";

export default async function ProfileSettingsPage() {
  const user = (await getAuthSession())!;
  const username = getEmailDisplayName(user.email);

  return (
    <DetailSectionCard
      title="Account Details"
      description="View your account profile information."
      flushContent
    >
      <dl>
        <div className={DETAIL_ROW_CLASS}>
          <dt className="text-sm font-medium text-neutral-500">Username</dt>
          <dd className="text-sm text-neutral-900">{username}</dd>
        </div>
        <div className={DETAIL_ROW_CLASS}>
          <dt className="text-sm font-medium text-neutral-500">Email Address</dt>
          <dd className="text-sm text-neutral-900">{user.email}</dd>
        </div>
        <div className={DETAIL_ROW_CLASS}>
          <dt className="text-sm font-medium text-neutral-500">Account ID</dt>
          <dd className="font-mono text-xs text-neutral-900 sm:text-sm">{user.id}</dd>
        </div>
      </dl>
    </DetailSectionCard>
  );
}
