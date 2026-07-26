"use client";

import {
  Cpu,
  Play,
  Plus,
  RotateCcw,
  ShieldAlert,
  Thermometer,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminMiningPage() {
  const [plans, setPlans] = useState([
    {
      id: "p1",
      name: "S19 Miner Cluster Alpha",
      hashrate: "110 TH/s",
      power: "3250W",
      activeUsers: 412,
      fee: "2%",
    },
    {
      id: "p2",
      name: "S21 Miner Cluster Beta",
      hashrate: "200 TH/s",
      power: "3500W",
      activeUsers: 648,
      fee: "1.5%",
    },
    {
      id: "p3",
      name: "M50 Miner Cluster Gamma",
      hashrate: "172 TH/s",
      power: "3300W",
      activeUsers: 188,
      fee: "2.5%",
    },
  ]);

  const handleRebootArray = (arrayName: string) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Rebooting ${arrayName}...`,
      success: `${arrayName} system registers successfully hot-rebooted!`,
      error: "Failed to reboot hardware array.",
    });
  };

  const handleUpdatePayoutFee = (planId: string) => {
    toast.success("ASIC yield difficulty index settings updated.");
  };

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-red-400 uppercase tracking-wider">
            Hardware & Nodes Control
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white animate-fade-in">
            Mining Clusters
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Monitor real-time system temperatures, configure active pool
            distribution fees, and manage hashing arrays.
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-500 text-white text-[13px] font-semibold h-10 rounded-[14px] px-md">
          <Plus className="w-4 h-4 mr-2" /> Add Hardware Cluster
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start mt-xs">
        {/* Plan Configuration Table (8 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-8 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <h3 className="text-[16px] font-semibold text-white">
            Active Hashing Arrays
          </h3>
          <div className="flex flex-col gap-sm">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-md bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[16px] flex flex-col sm:flex-row justify-between sm:items-center gap-md"
              >
                <div className="flex items-center gap-sm">
                  <Cpu className="w-5 h-5 text-red-400" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{plan.name}</span>
                    <span className="text-[11px] text-zinc-500">
                      Hash capacity: {plan.hashrate} | Draw: {plan.power}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-md text-xs font-semibold text-zinc-400">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase">
                      Users
                    </span>
                    <span className="text-white mt-0.5">
                      {plan.activeUsers}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase">
                      Pool Fee
                    </span>
                    <span className="text-white mt-0.5">{plan.fee}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase">
                      Status
                    </span>
                    <span className="text-green-400 mt-0.5">Online</span>
                  </div>
                </div>

                <div className="flex items-center gap-xs ml-auto sm:ml-0">
                  <Button
                    onClick={() => handleRebootArray(plan.name)}
                    variant="ghost"
                    className="text-xs h-8 bg-[#1D1D22] border border-[rgba(255,255,255,0.06)] hover:bg-[#27272D] rounded-[10px] px-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    onClick={() => handleUpdatePayoutFee(plan.id)}
                    className="text-xs h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-[10px] px-3 font-semibold"
                  >
                    Edit Config
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Informative Side Cards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-md">
          <Card
            variant="flat"
            className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
          >
            <div className="flex items-center gap-sm">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-[15px]">Uptime Policies</span>
            </div>
            <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
              Geothermal cluster cooling systems in Reykjavik monitor node
              temperature spikes. In case of peak triggers above 75°C,
              individual chip boards auto-throttle to protect hardware
              aggregates.
            </p>
          </Card>

          <Card
            variant="flat"
            className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
          >
            <div className="flex items-center gap-sm">
              <Zap className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-[15px]">
                Global Hashing Speed
              </span>
            </div>
            <div className="flex flex-col mt-xs">
              <span className="text-[24px] font-semibold">482.5 TH/s</span>
              <span className="text-zinc-500 text-xs">
                Total cumulative capacity draw
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
