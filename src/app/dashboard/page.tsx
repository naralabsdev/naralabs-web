import {
  DASHBOARD_USAGE_LIMITS,
  DETAIL_ROW_CLASS,
} from "@/app/dashboard/constants";
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
    <>
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
            <dt className="text-sm font-medium text-neutral-500">
              Your Email Address
            </dt>
            <dd className="text-sm text-neutral-900">{user.email}</dd>
          </div>
          <div className={DETAIL_ROW_CLASS}>
            <dt className="text-sm font-medium text-neutral-500">
              Email Verification
            </dt>
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

      <DetailSectionCard
        title="Overview Usage"
        description="Usage of account features such as address watch list, address name tags, and API keys."
        flushContent
      >
        <dl>
          <div className={DETAIL_ROW_CLASS}>
            <dt className="text-sm font-medium text-neutral-500">
              Total XLM Balance (Watch List)
            </dt>
            <dd className="text-sm text-neutral-900">0 XLM</dd>
          </div>
          <div className={DETAIL_ROW_CLASS}>
            <dt className="text-sm font-medium text-neutral-500">
              Email Notification Limit
            </dt>
            <dd className="text-sm text-neutral-900">
              0 emails sent out
              <p className="mt-1 text-xs text-neutral-500">
                {DASHBOARD_USAGE_LIMITS.emailNotificationsDaily} daily limit
              </p>
            </dd>
          </div>
          <div className={DETAIL_ROW_CLASS}>
            <dt className="text-sm font-medium text-neutral-500">Address Watch List</dt>
            <dd className="text-sm text-neutral-900">
              0 address alert(s)
              <p className="mt-1 text-xs text-neutral-500">
                {DASHBOARD_USAGE_LIMITS.watchListAddresses} limit
              </p>
            </dd>
          </div>
          <div className={DETAIL_ROW_CLASS}>
            <dt className="text-sm font-medium text-neutral-500">Txn Private Notes</dt>
            <dd className="text-sm text-neutral-900">
              0 transaction private note(s)
              <p className="mt-1 text-xs text-neutral-500">
                {DASHBOARD_USAGE_LIMITS.txnPrivateNotes.toLocaleString()} limit
              </p>
            </dd>
          </div>
          <div className={DETAIL_ROW_CLASS}>
            <dt className="text-sm font-medium text-neutral-500">Address Tags</dt>
            <dd className="text-sm text-neutral-900">
              0 address tag(s)
              <p className="mt-1 text-xs text-neutral-500">
                {DASHBOARD_USAGE_LIMITS.addressTags.toLocaleString()} limit
              </p>
            </dd>
          </div>
          <div className={DETAIL_ROW_CLASS}>
            <dt className="text-sm font-medium text-neutral-500">API Key Usage</dt>
            <dd className="text-sm text-neutral-900">
              0 active API(s)
              <p className="mt-1 text-xs text-neutral-500">
                {DASHBOARD_USAGE_LIMITS.apiKeys} limit
              </p>
            </dd>
          </div>
          <div className={DETAIL_ROW_CLASS}>
            <dt className="text-sm font-medium text-neutral-500">Verified Addresses</dt>
            <dd className="text-sm text-neutral-900">
              0 verified addresses
              <p className="mt-1 text-xs text-neutral-500">Unlimited</p>
            </dd>
          </div>
        </dl>
      </DetailSectionCard>
    </>
  );
}
