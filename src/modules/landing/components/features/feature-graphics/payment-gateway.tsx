import { getAppUrl } from "@/shared/config/site";
import { BrowserPreviewFrame } from "@/shared/ui/browser-preview-frame";

export function PaymentGateway() {
  return (
    <div
      className="flex size-full items-start justify-center overflow-hidden [mask-image:linear-gradient(black_55%,transparent)]"
      aria-hidden
    >
      <div className="origin-top scale-[0.72] sm:scale-[0.80]">
        <BrowserPreviewFrame url={`${getAppUrl()}/c/demo`} className="w-[400px]">
          <div className="flex flex-col gap-4 p-4">
            <div className="rounded-md bg-[#0f3359] px-3 py-2 text-center text-xs font-medium text-white">
              Sandbox checkout
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">Acme Co</p>
                <p className="text-xs text-neutral-500">Pro plan (monthly)</p>
              </div>
              <p className="text-lg font-semibold text-neutral-900">$49.00</p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-3">
              <p className="text-xs font-medium text-neutral-500">Pay with</p>
              <div className="mt-2 flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2">
                <span className="text-sm font-medium text-neutral-900">USDC</span>
                <span className="text-xs text-neutral-500">49.00</span>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              disabled
            >
              Pay now
            </button>
          </div>
        </BrowserPreviewFrame>
      </div>
    </div>
  );
}
