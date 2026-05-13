// قم بإضافة هذه الاستيرادات في ملف المكون
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function GuestProfileView() {
  const [trackId, setTrackId] = useState("");
  const router = useRouter();

  const handleTrack = () => {
    if (!trackId) return;
    router.push(`/track-order?id=${trackId.trim()}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#050505]"
      dir="rtl"
    >
      <div className="max-w-md w-full text-center space-y-8">

        <div className="pt-8 border-t border-slate-200 dark:border-white/5">
          <p className="text-sm text-slate-400 mb-4 font-bold uppercase tracking-widest">
            أو تابع أوردر سريع
          </p>
          <div className="relative group">
            <input
              type="text"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()} 
              placeholder="دخل رقم الأوردر هنا..."
              className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-5 rounded-[1.8rem] pr-12 focus:border-primary outline-none transition-all font-bold"
            />
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <button
              onClick={handleTrack}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-100 dark:bg-white/5 p-3 rounded-2xl hover:bg-primary hover:text-black transition-colors font-black text-xs"
            >
              تتبع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
