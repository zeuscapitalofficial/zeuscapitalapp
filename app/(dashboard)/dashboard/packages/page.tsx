"use client";

import { Cpu, HardDrive, Thermometer, Zap } from "lucide-react";
import { DashboardAreaChart } from "@/components/charts/dashboard-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const rigData = [
  {
    id: "rig-01",
    name: "Antminer S19 Pro #01",
    hashrate: "110.0 TH/s",
    efficiency: "29.5 J/TH",
    power: "3,250 W",
    temp: "68°C",
    status: "active",
  },
  {
    id: "rig-02",
    name: "Antminer S21 #02",
    hashrate: "200.0 TH/s",
    efficiency: "17.5 J/TH",
    power: "3,500 W",
    temp: "65°C",
    status: "active",
  },
  {
    id: "rig-03",
    name: "Whatsminer M50 #03",
    hashrate: "172.5 TH/s",
    efficiency: "28.0 J/TH",
    power: "3,300 W",
    temp: "71°C",
    status: "active",
  },
];

const dailyPayoutData = [
  { label: "Mon", value: 25.4 },
  { label: "Tue", value: 26.1 },
  { label: "Wed", value: 28.5 },
  { label: "Thu", value: 27.9 },
  { label: "Fri", value: 28.12 },
  { label: "Sat", value: 29.4 },
  { label: "Sun", value: 28.5 },
];

export default function PackagesPage() {
  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
            ASIC Node Registry
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white">
            ASIC Packages
          </h1>
          <p className="text-[15px] text-[rgba(255,255,255,0.72)] font-medium">
            Monitor real-time ASIC rig hashrates, chip temperatures, power
            consumption, and mining payouts.
          </p>
        </div>
        <div className="flex gap-sm">
          <Button
            variant="outline"
            className="border-[rgba(255,255,255,0.06)] bg-[#111114] text-[13px] font-semibold hover:bg-[#1D1D22] h-10 rounded-[14px]"
          >
            Reboot All Nodes
          </Button>
          <Button className="bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px] px-md">
            Purchase ASIC Rig
          </Button>
        </div>
      </div>

      {/* Grid: Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <Card
          variant="flat"
          className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-sm"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            Total Hashrate
          </span>
          <div className="flex flex-col">
            <span className="text-[28px] font-semibold tracking-[-0.02em]">
              482.5 TH/s
            </span>
            <span className="text-[12px] text-green-400 font-semibold mt-1">
              100% of target capacity
            </span>
          </div>
        </Card>

        <Card
          variant="flat"
          className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-sm"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            Active Packages
          </span>
          <div className="flex flex-col">
            <span className="text-[28px] font-semibold tracking-[-0.02em]">
              3 / 3 Online
            </span>
            <span className="text-[12px] text-green-400 font-semibold mt-1">
              0 active hardware errors
            </span>
          </div>
        </Card>

        <Card
          variant="flat"
          className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-sm"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            Total Power Draw
          </span>
          <div className="flex flex-col">
            <span className="text-[28px] font-semibold tracking-[-0.02em]">
              10,050 W
            </span>
            <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-medium mt-1">
              Iceland Geothermal Facility
            </span>
          </div>
        </Card>

        <Card
          variant="flat"
          className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-sm"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            BTC Mined (All Time)
          </span>
          <div className="flex flex-col">
            <span className="text-[28px] font-semibold tracking-[-0.02em]">
              1.4820 BTC
            </span>
            <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-medium mt-1">
              ~$101,546.64 value
            </span>
          </div>
        </Card>
      </div>

      {/* Grid: Charts & Rig Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-stretch">
        {/* RIG LIST (7 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-7 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <h3 className="text-[18px] font-semibold text-white pb-md border-b border-[rgba(255,255,255,0.06)]">
            ASIC Hardware Clusters
          </h3>
          <div className="flex flex-col gap-4">
            {rigData.map((rig) => (
              <div
                key={rig.id}
                className="p-md bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[16px] flex flex-col gap-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-sm">
                    <HardDrive className="w-5 h-5 text-[#8B7CFF]" />
                    <span className="font-semibold text-[15px]">
                      {rig.name}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-xs px-2 py-0.5 rounded-[99px] text-[11px] font-semibold bg-green-500/10 text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {rig.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-md text-[13px] font-medium pt-2 border-t border-[rgba(255,255,255,0.02)]">
                  <div className="flex flex-col">
                    <span className="text-[rgba(255,255,255,0.48)] mb-1">
                      Hashrate
                    </span>
                    <span className="text-white font-semibold">
                      {rig.hashrate}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[rgba(255,255,255,0.48)] mb-1">
                      Efficiency
                    </span>
                    <span className="text-white font-semibold">
                      {rig.efficiency}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[rgba(255,255,255,0.48)] mb-1">
                      Power
                    </span>
                    <span className="text-white font-semibold flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />{" "}
                      {rig.power}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[rgba(255,255,255,0.48)] mb-1">
                      Temp
                    </span>
                    <span className="text-white font-semibold flex items-center gap-2">
                      <Thermometer className="w-3.5 h-3.5 text-red-400" />{" "}
                      {rig.temp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily Payout Chart (5 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-5 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-lg justify-between"
        >
          <div className="flex flex-col gap-xs">
            <h3 className="text-[18px] font-semibold text-white">
              Daily Revenue
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Estimated daily yield (USD value) over 7 days
            </p>
          </div>
          <div className="h-[180px] w-full">
            <DashboardAreaChart
              data={dailyPayoutData}
              valueType="currency"
              strokeColor="#22C55E"
            />
          </div>
          <div className="p-md bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[16px] text-center text-[13px] font-semibold text-[rgba(255,255,255,0.72)]">
            Daily payout: ~0.000417 BTC ($28.50) credited to wallet.
          </div>
        </Card>
      </div>
    </div>
  );
}
