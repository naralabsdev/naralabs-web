import { getEmailDisplayName } from "@/modules/auth/lib/auth-user";
import { getAuthSession } from "@/modules/auth/lib/session.server";
import { DETAIL_ROW_CLASS } from "@/app/(site)/dashboard/constants";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { Button } from "@/shared/ui/button";

export default async function ProfileSettingsPage() {
  const user = (await getAuthSession())!;
  const username = getEmailDisplayName(user.email);

  return (
    <>
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

      <DetailSectionCard
        title="Security"
        description="Password and security settings will be available soon."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900">Password</p>
            <p className="mt-1 text-sm text-neutral-500">
              Update your password to keep your account secure.
            </p>
          </div>
          <Button
            type="button"
            text="Change Password"
            variant="secondary"
            className="h-9 rounded-lg px-4"
            disabled
          />
        </div>
      </DetailSectionCard>
    </>
  );
}
