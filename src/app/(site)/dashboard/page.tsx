import { DETAIL_ROW_CLASS } from "@/app/(site)/dashboard/constants";
import { getEmailDisplayName } from "@/modules/auth/lib/auth-user";
import { getAuthSession } from "@/modules/auth/lib/session.server";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";

function formatLastLogin() {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date());
}

export default async function DashboardPage() {
  const user = (await getAuthSession())!;
  const username = getEmailDisplayName(user.email);

  return (
    <DetailSectionCard
      title="Personal Info"
      description="Below are the username, email and overview information for your account."
      flushContent
    >
      <dl>
        <div className={DETAIL_ROW_CLASS}>
          <dt className="text-sm font-medium text-neutral-500">Your username</dt>
          <dd className="text-sm text-neutral-900">{username}</dd>
        </div>
        <div className={DETAIL_ROW_CLASS}>
          <dt className="text-sm font-medium text-neutral-500">Your Email Address</dt>
          <dd className="text-sm text-neutral-900">{user.email}</dd>
        </div>
        <div className={DETAIL_ROW_CLASS}>
          <dt className="text-sm font-medium text-neutral-500">Email Verification</dt>
          <dd className="text-sm text-neutral-900">
            {user.emailVerified ? "Verified" : "Pending verification"}
          </dd>
        </div>
        <div className={DETAIL_ROW_CLASS}>
          <dt className="text-sm font-medium text-neutral-500">Last Login</dt>
          <dd className="text-sm text-neutral-900">{formatLastLogin()}</dd>
        </div>
      </dl>
    </DetailSectionCard>
  );
}
