export const explorerPageHeaderClass = "w-full text-left";

export const explorerPageTitleClass =
  "text-xl font-semibold tracking-tight text-white sm:text-2xl";

export const explorerPageDescriptionClass =
  "mt-1.5 max-w-2xl text-sm text-white/85 text-pretty";

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
