export const InlineSnippet = ({ children }: { children: string }) => {
  return (
    <span className="inline-block rounded-md bg-primary-subtle px-1 py-0.5 font-mono text-primary-subtle-foreground">
      {children}
    </span>
  );
};
