import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import { SITE_FOOTER } from "@/modules/landing/constants/homepage-content";
import { ArrowUpRight2 } from "@/shared/ui/icons";
import Link from "next/link";
import { Logo } from "@/shared/ui/logo";
import { getDocsUrl, getGithubUrl } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";

function resolveFooterHref(href: string, githubUrl: string) {
  if (href === "docs") return getDocsUrl();
  if (href === "github") return githubUrl;
  return href;
}

export function Footer({ className }: { className?: string }) {
  const githubUrl = getGithubUrl();
  const socials: { label: string; href: string; path: string }[] = [
    {
      label: "GitHub",
      href: githubUrl,
      path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z",
    },
  ];

  return (
    <footer className={cn("relative mt-20 border-t border-neutral-200/80 bg-white", className)}>
      <MarketingContent className="py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="inline-block rounded-lg outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-neutral-300"
            >
              <Logo variant="light" className="h-9" />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-neutral-500">
              {SITE_FOOTER.tagline}
            </p>
          </div>

          {SITE_FOOTER.columns.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-sm font-medium text-neutral-900">{title}</h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {links.map((link) => {
                  const href = resolveFooterHref(link.href, githubUrl);

                  return (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                        >
                          {link.label}
                          <ArrowUpRight2 className="size-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-neutral-200 pt-8 sm:flex-row">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Naralabs, Inc.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-500 transition-colors hover:text-neutral-900"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                  aria-hidden
                >
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </MarketingContent>
    </footer>
  );
}
