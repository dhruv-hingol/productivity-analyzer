import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopupFooterProps {
  onOpenOptions: () => void;
}

export const PopupFooter = ({ onOpenOptions }: PopupFooterProps) => {
  return (
    <Button
      onClick={onOpenOptions}
      className="w-full flex items-center justify-center gap-2 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/10"
    >
      View Full Analytics
      <ExternalLink size={14} />
    </Button>
  );
};
