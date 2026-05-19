import {
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";

export function SideBar() {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col sticky top-0 h-screen">
      {/* Logo / اسم المكتب */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold tracking-tight text-primary">
          الدولي للدليفري
        </h1>
        <p className="text-xs text-sidebar-foreground/50">لوحة التحكم</p>
      </div>

      {/* روابط التنقل - Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <SidebarItem
          href="/dashboard"
          icon={<LayoutDashboard size={20} />}
          label="الرئيسية"
        />
        <SidebarItem
          href="/orders"
          icon={<ShoppingCart size={20} />}
          label="الطلبات"
        />
        <SidebarItem
          href="/couriers"
          icon={<Users size={20} />}
          label="الطيارين"
        />
        {/* <SidebarItem
          href="/settings"
          icon={<Settings size={20} />}
          label="الإعدادات"
        /> */}
      </nav>

      {/* جزء المستخدم في الأسفل */}
      <div className="p-4 border-t border-sidebar-border">
        <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-destructive">
          <LogOut size={20} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all group"
    >
      <span className="text-sidebar-foreground/70 group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
