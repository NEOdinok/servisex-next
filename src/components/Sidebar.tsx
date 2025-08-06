import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col justify-between bg-background p-4 transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "sm:hidden",
      )}
    >
      <div className="flex flex-col h-full justify-between mb-24 gap-4">
        <button onClick={onClose} aria-label="Close menu" className="self-start">
          <X size={32} />
        </button>

        <div className="flex flex-col gap-4 items-center">
          <Link href="/" onClick={onClose} className="font-bold text-3xl hover:underline">
            МАГАЗИН
          </Link>

          <Link href="/about" className="font-bold text-3xl hover:underline">
            КОНТАКТЫ
          </Link>
        </div>
      </div>
    </div>
  );
};
