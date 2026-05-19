import { SideBar } from "@/components/admin/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background w-full" dir="rtl">
      <SideBar />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
