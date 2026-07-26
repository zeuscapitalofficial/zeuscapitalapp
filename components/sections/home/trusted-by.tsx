export function TrustedBySection() {
  const backers = [
    {
      name: "Fundamental Labs",
      style: {
        fontFamily: '"Times New Roman", Times, serif',
        fontWeight: 400,
        letterSpacing: "0.02em",
        fontSize: "14px",
      },
    },
    {
      name: "KUCOIN",
      style: {
        fontFamily: '"Arial Black", sans-serif',
        fontWeight: 900,
        letterSpacing: "0.08em",
        fontSize: "16px",
      },
    },
    {
      name: "NGC",
      style: {
        fontFamily: 'Impact, "Arial Narrow", sans-serif',
        fontWeight: 700,
        letterSpacing: "0.05em",
        fontSize: "18px",
      },
    },
    {
      name: "NxGen",
      style: {
        fontFamily: "Georgia, serif",
        fontWeight: 600,
        letterSpacing: "-0.02em",
        fontSize: "17px",
      },
    },
    {
      name: "Matter Labs",
      style: {
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        fontSize: "15px",
      },
    },
    {
      name: "DEXTools",
      style: {
        fontFamily: "Verdana, sans-serif",
        fontWeight: 700,
        letterSpacing: "0.06em",
        fontSize: "14px",
        textTransform: "uppercase" as const,
      },
    },
    {
      name: "NGRAVE",
      style: {
        fontFamily: '"Courier New", Courier, monospace',
        fontWeight: 700,
        letterSpacing: "0.18em",
        fontSize: "14px",
      },
    },
    {
      name: "Polychain",
      style: {
        fontFamily: 'Palatino, "Book Antiqua", serif',
        fontWeight: 500,
        letterSpacing: "0.03em",
        fontSize: "15px",
      },
    },
  ];

  return (
    <section className="bg-background px-lg py-xl border-t border-b border-[rgba(0,0,0,0.04)] w-full overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes backers-marquee {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .backers-track {
              display: flex;
              width: max-content;
              animation: backers-marquee 30s linear infinite;
            }
          `,
        }}
      />
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-lg items-center">
        {/* Left Column (1/4) */}
        <div className="md:col-span-1">
          <p className="text-text-secondary text-[16px] leading-relaxed font-semibold">
            Funded by premier partners
            <br />
            and forward-thinking leaders.
          </p>
        </div>

        {/* Right Column (3/4) */}
        <div className="md:col-span-3 overflow-hidden w-full relative">
          {/* Subtle fade effect on sides */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="backers-track">
            {/* First loop */}
            {backers.map((backer, idx) => (
              <span
                key={`backer-1-${backer.name}`}
                className="mx-lg shrink-0 text-text-secondary whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-150"
                style={backer.style}
              >
                {backer.name}
              </span>
            ))}
            {/* Second loop */}
            {backers.map((backer, idx) => (
              <span
                key={`backer-2-${backer.name}`}
                className="mx-lg shrink-0 text-text-secondary whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-150"
                style={backer.style}
              >
                {backer.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Alias export
export { TrustedBySection as BackedBySection };
