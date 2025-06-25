export default function NavbarContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center">{children}</div>
      </header>
      <div className="h-14" />
    </>
  );
}
