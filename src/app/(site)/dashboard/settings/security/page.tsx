import { ChangePasswordForm } from "@/modules/security/components/change-password-form";
import { SECURITY_COPY } from "@/modules/security/constants/security-copy";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";

export default function SecuritySettingsPage() {
  return (
    <DetailSectionCard
      title={SECURITY_COPY.securitySettings.changePasswordTitle}
      description={SECURITY_COPY.securitySettings.changePasswordDescription}
      contentClassName="px-5 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-3"
    >
      <ChangePasswordForm />
    </DetailSectionCard>
  );
}
