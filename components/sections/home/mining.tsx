import { Activity } from "lucide-react";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { Card } from "@/components/ui/card";

export function MiningSection() {
  const miningRewardData = [
    { label: "Week 1", value: 12.4 },
    { label: "Week 2", value: 14.8 },
    { label: "Week 3", value: 14.1 },
    { label: "Week 4", value: 16.9 },
    { label: "Week 5", value: 18.2 },
    { label: "Week 6", value: 20.4 },
    { label: "Week 7", value: 22.8 },
  ];

  return (
    <section
      id="mining"
      className="py-3xl bg-white border-t border-b border-[rgba(0,0,0,0.06)]"
    >
      <div className="max-w-[88rem] mx-auto px-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2xl items-center">
          {/* Left Column: Text & Stats */}
          <div className="lg:col-span-5 flex flex-col gap-lg items-start">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
              Physical Infrastructure
            </span>
            <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-[1.1] text-black">
              Industrial mining, fully managed.
            </h2>
            <p className="text-[16px] leading-relaxed text-[rgba(0,0,0,0.7)]">
              Avoid the complexities of operating mining rigs. We manage
              hardware procurement, high-voltage electrical engineering, and
              constant thermal optimization. Monitor metrics in real-time.
            </p>

            {/* Grid of stats */}
            <div className="grid grid-cols-2 gap-md w-full pt-md border-t border-[rgba(0,0,0,0.08)] mt-md">
              <div>
                <span className="text-[13px] text-[rgba(0,0,0,0.55)] block mb-xs">
                  Active Hashrate
                </span>
                <span className="text-[24px] font-bold text-black">
                  342 PH/s
                </span>
              </div>
              <div>
                <span className="text-[13px] text-[rgba(0,0,0,0.55)] block mb-xs">
                  Facility Uptime
                </span>
                <span className="text-[24px] font-bold text-black">99.98%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Chart Visual */}
          <div className="lg:col-span-7 w-full">
            <Card variant="elevated" className="w-full">
              <div className="flex items-center justify-between mb-lg">
                <div>
                  <h4 className="text-[16px] font-semibold text-black">
                    Accumulated Block Rewards
                  </h4>
                  <span className="text-[13px] text-[rgba(0,0,0,0.55)]">
                    Daily distribution metrics (BTC)
                  </span>
                </div>
                <span className="inline-flex items-center gap-[4px] bg-slate-50 text-slate-700 text-[13px] font-semibold px-[10px] py-[4px] rounded-full border border-[rgba(0,0,0,0.06)]">
                  <Activity size={12} />
                  Stable Hash
                </span>
              </div>
              <div className="w-full">
                <PerformanceChart
                  data={miningRewardData}
                  height={260}
                  strokeColor="#2B2644"
                  valueType="btc"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
