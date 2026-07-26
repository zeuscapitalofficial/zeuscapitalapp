export function AboutTimelineSection() {
  const timelineMilestones = [
    {
      year: "2023",
      title: "Foundation & Capitalization",
      description:
        "Zeus Capital is established by engineers and commodity brokers. Secured initial seed capital to fund sustainable tier-3 mining infrastructure.",
    },
    {
      year: "2024",
      title: "Industrial Hosting Rollout",
      description:
        "Commissioned our first hydroelectric-powered hosting facility, deploying 100 PH/s of physical hashrate under contract.",
    },
    {
      year: "2025",
      title: "Institutional OTC Desk",
      description:
        "Launched digital asset brokerage desk, integrating Multi-Party Computation (MPC) cold storage for settlement security.",
    },
    {
      year: "2026",
      title: "Ecosystem Integration",
      description:
        "Surpassed 340 PH/s active hosting hashrate. Unifying industrial mining analytics with spot brokerage platforms.",
    },
  ];

  return (
    <section className="py-3xl px-md max-w-[88rem] mx-auto w-full">
      <div className="flex flex-col gap-md mb-3xl max-w-4xl">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
          Chronology
        </span>
        <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-tight text-black">
          Milestones of execution.
        </h2>
      </div>

      {/* Vertical Timeline Component */}
      <div className="relative border-l border-[rgba(0,0,0,0.08)] ml-sm pl-xl space-y-2xl max-w-4xl">
        {timelineMilestones.map((milestone) => (
          <div key={milestone.year} className="relative group">
            {/* Outer Bullet */}
            <div className="absolute -left-[54px] top-[4px] w-[21px] h-[21px] bg-[#F5F5F5] border-2 border-black rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" />

            <div>
              <span className="text-[14px] font-bold text-[rgba(0,0,0,0.4)] font-mono block mb-xs">
                {milestone.year}
              </span>
              <h4 className="text-[21px] font-semibold text-black mb-xs">
                {milestone.title}
              </h4>
              <p className="text-[14px] leading-relaxed text-[rgba(0,0,0,0.55)] max-w-4xl">
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
