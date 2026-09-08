export const explorerPageHeaderClass = "mb-6 sm:mb-7";

export const explorerPageTitleClass =
  "text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl";

export const explorerPageDescriptionClass = "mt-1.5 max-w-2xl text-sm text-neutral-500";

export function ExplorerPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className={explorerPageHeaderClass}>
      <h1 className={explorerPageTitleClass}>{title}</h1>
      <p className={explorerPageDescriptionClass}>{description}</p>
    </header>
  );
}
