"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Truck,
  LogIn,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
  Home,
  HelpCircle,
  MapPin,
  MessageSquare,
  Search,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const navLinks = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "كيف نعمل", href: "/#how-it-works", icon: HelpCircle },
  { name: "مناطق التغطية", href: "/#zones", icon: MapPin },
  { name: "تواصل معنا", href: "/#contact", icon: MessageSquare },
  { name: "تتبع الطلب", href: "/track-order", icon: Search },
];

type UserWithRole = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "ADMIN" | "USER";
};

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as UserWithRole | undefined;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
      dir="rtl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-primary/10 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              dir="rtl"
              className="w-[300px] flex flex-col p-0 border-l-primary/10"
            >
              <div className="p-6">
                <SheetHeader>
                  <SheetTitle className="text-right flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-xl">
                      <Truck className="h-6 w-6 text-black" />
                    </div>
                    <span className="font-black text-2xl italic">الدولي</span>
                  </SheetTitle>
                </SheetHeader>
              </div>

              <Separator className="opacity-50" />

              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-primary text-black shadow-md"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-black" : "text-primary"
                        }`}
                      />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 mt-auto">
                {session ? (
                  <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] border border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          <User size={20} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-black truncate max-w-[150px]">
                          {session.user.name}
                        </span>
                        <span className="text-[10px] opacity-50 uppercase font-bold tracking-tighter">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold h-10 border-border/50"
                      >
                        <Link
                          href={
                            user?.role === "ADMIN" ? "/dashboard" : "/profile"
                          }
                        >
                          {user?.role === "ADMIN" ? "اللوحة" : "الملف"}
                        </Link>
                      </Button>
                      <Button
                        onClick={handleSignOut}
                        variant="destructive"
                        size="sm"
                        className="rounded-xl font-bold h-10"
                      >
                        <LogOut className="h-4 w-4 ml-1" /> خروج
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className="w-full">
                    <Button className="w-full h-12 rounded-2xl font-black gap-2 shadow-lg shadow-primary/20">
                      <LogIn className="h-5 w-5" /> تسجيل دخول الإدارة
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="bg-primary p-1.5 rounded-lg">
              <Truck className="h-6 w-6 text-black" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-foreground italic group-hover:text-primary transition-colors">
              الدولي
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 mr-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all hover:bg-primary/10 ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!isPending && (
            <>
              {session ? (
                <div className="hidden sm:block">
                  <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full border-2 border-primary/20 p-0 overflow-hidden hover:border-primary transition-all"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={session.user.image || ""}
                            alt={session.user.name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 mt-2 rounded-[1.5rem] p-2"
                      align="end"
                    >
                      <DropdownMenuLabel className="text-right px-4 py-3">
                        <p className="font-black text-sm">
                          {session.user.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {session.user.email}
                        </p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl cursor-pointer py-2.5"
                      >
                        <Link
                          href={
                            user?.role === "ADMIN" ? "/dashboard" : "/profile"
                          }
                          className="w-full flex items-center gap-2 font-bold"
                        >
                          {user?.role === "ADMIN" ? (
                            <LayoutDashboard size={18} />
                          ) : (
                            <Settings size={18} />
                          )}
                          <span>
                            {user?.role === "ADMIN"
                              ? "لوحة الإدارة"
                              : "الملف الشخصي"}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="rounded-xl cursor-pointer py-2.5 text-destructive focus:bg-destructive/10 flex items-center gap-2 font-bold"
                      >
                        <LogOut size={18} />
                        <span>تسجيل الخروج</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block">
                  <Button
                    variant="default"
                    className="gap-2 font-black px-6 rounded-xl shadow-md hover:shadow-primary/20 transition-all"
                  >
                    <LogIn className="h-4 w-4" /> دخول الإدارة
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
