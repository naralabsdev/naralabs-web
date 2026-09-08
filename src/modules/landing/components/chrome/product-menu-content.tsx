"use client";

import {
  PaymentsGraphic,
  QRGraphic,
  WebhooksGraphic,
} from "@/modules/landing/components/chrome/nav-feature-graphics";
import { NARALABS_EXPLORE_CHILD_ITEMS } from "@/modules/landing/components/chrome/nav-items";
import { Grid } from "@/shared/ui/grid";
import { cn } from "@/shared/lib/cn";
import { Link as NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { CSSProperties, type ComponentType } from "react";

const productMeta: Record<
  string,
  {
    color: string;
    iconClass: string;
    graphic: ComponentType;
  }
> = {
  Events: {
    color: "var(--primary)",
    iconClass: "bg-gradient-to-b from-primary to-primary-hover",
    graphic: PaymentsGraphic,
  },
  Contracts: {
    color: "#F4950C",
    iconClass: "bg-gradient-to-b from-orange-500 to-orange-600",
    graphic: QRGraphic,
  },
  Search: {
    color: "#F43F5E",
    iconClass: "bg-gradient-to-b from-rose-500 to-rose-600",
    graphic: WebhooksGraphic,
  },
};

export function NaralabsProductContent({ domain: _domain }: { domain: string }) {
  return (
    <div className="grid w-[960px] max-w-[calc(100vw-2rem)] grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
      {NARALABS_EXPLORE_CHILD_ITEMS.map(({ title, description, href, icon: Icon }) => {
        const meta = productMeta[title];

        return (
          <ProductCard
            key={title}
            title={title}
            description={description}
            href={href}
            color={meta.color}
            icon={Icon}
            iconClass={meta.iconClass}
            graphic={meta.graphic}
          />
        );
      })}
    </div>
  );
}

function ProductCard({
  title,
  description,
  href,
  color,
  icon: Icon,
  iconClass,
  graphic: Graphic,
}: {
  title: string;
  description: string;
  href: string;
  color: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  iconClass: string;
  graphic: ComponentType;
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50"
      >
        <Grid
          className="[mask-image:linear-gradient(transparent,black,transparent)] text-neutral-300"
          cellSize={60}
          patternOffset={[-51, -23]}
        />
        <div className="relative p-4 pb-0">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-white shadow-sm",
              iconClass,
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
          </div>
          <span className="mt-3 block text-sm font-medium text-neutral-900">
            {title}
          </span>
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        </div>
        <div className="relative mt-4 h-28 overflow-hidden [mask-image:linear-gradient(black_50%,transparent)]">
          <div className="absolute left-0 top-0 h-[302px] w-[520px] origin-top-left scale-[0.45]">
            <Graphic />
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,var(--color),transparent)] opacity-[0.07] transition-opacity duration-150 group-hover:opacity-15"
          style={{ "--color": color } as CSSProperties}
        />
      </Link>
    </NavigationMenuLink>
  );
}
