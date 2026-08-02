import { Activity } from "lucide-react";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { Card } from "@/components/ui/card";

export function MiningSection() {
  return (
    <section id="mining" className="py-3x">
      <div className="max-w-[88rem] mx-auto px-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2xl items-center">
          {/* Left Column: Text */}
          <div className="lg:col-span-5 flex flex-col gap-lg items-start">
            <span className="text-[13px] font-semibold uppercase tracking-wider ">
              Physical Infrastructure
            </span>
            <h2 className="text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic max-w-118 leading-[1.1] text-black">
              Industrial mining, fully managed.
            </h2>
            <p className="text-[16px] leading-relaxed ">
              Avoid the complexities of operating mining rigs. We manage
              hardware procurement, high-voltage electrical engineering, and
              constant thermal optimization. Monitor metrics in real-time.
            </p>
          </div>

          {/* Right Column: Chart Visual */}
          <div className="lg:col-span-7 w-full">
            <PerformanceChart />
          </div>
        </div>
      </div>
    </section>
  );
}
