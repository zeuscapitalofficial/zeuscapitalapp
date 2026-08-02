import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";

export function AboutTimelineSection() {
  const roadmap = [
    {
      id: "1",
      year: "2023",
      title: "Foundation & Capitalization",
      description:
        "Zeus Capital is established by engineers and commodity brokers. Secured initial seed capital to fund sustainable tier-3 mining infrastructure.",
    },
    {
      id: "2",
      year: "2024",
      title: "Industrial Hosting Rollout",
      description:
        "Commissioned our first hydroelectric-powered hosting facility, deploying 100 PH/s of physical hashrate under contract.",
    },
    {
      id: "3",
      year: "2025",
      title: "Institutional OTC Desk",
      description:
        "Launched digital asset brokerage desk, integrating Multi-Party Computation (MPC) cold storage for settlement security.",
    },
    {
      id: "4",
      year: "2026",
      title: "Ecosystem Integration",
      description:
        "Surpassed 340 PH/s active hosting hashrate. Unifying industrial mining analytics with spot brokerage platforms.",
    },
    {
      id: "5",
      year: "2027",
      title: "Upcoming...",
      description: "Expect great things from us.",
    },
  ];

  return (
    <section className="py-3xl px-md max-w-352 mx-auto w-full">
      <div className="flex flex-col gap-md mb-3xl max-w-4xl">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
          Chronology
        </span>
        <h2 className="text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic leading-tight text-black">
          Milestones of execution.
        </h2>
      </div>

      {/* Vertical Timeline Component */}

      <Timeline defaultValue={4} className="w-full max-w-7xl">
        {roadmap.map((item) => (
          <TimelineItem
            key={item.id}
            step={Number(item.id)}
            className="sm:group-data-[orientation=vertical]/timeline:ms-32"
          >
            <TimelineHeader>
              <TimelineSeparator />
              <TimelineDate className="sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:-left-32 sm:group-data-[orientation=vertical]/timeline:w-20 sm:group-data-[orientation=vertical]/timeline:text-right">
                {item.year}
              </TimelineDate>
              <TimelineTitle className="sm:-mt-0.5">{item.title}</TimelineTitle>
              <TimelineIndicator />
            </TimelineHeader>
            <TimelineContent>{item.description}</TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
