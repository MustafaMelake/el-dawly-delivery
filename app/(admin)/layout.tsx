export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <main className="flex-1 p-4 md:p-8 container mx-auto">{children}</main>
    </div>
  );
}
