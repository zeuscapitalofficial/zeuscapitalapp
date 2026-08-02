export function TrustedBySection() {
  const backers = [
    {
      name: "FUNDAMENTAL LABS",
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "0.1em",
        fontSize: "12px",
      },
    },
    {
      name: "KUCOIN",
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "0.15em",
        fontSize: "12px",
      },
    },
    {
      name: "NGC",
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "0.08em",
        fontSize: "12px",
      },
    },
    {
      name: "NXGEN",
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "0.12em",
        fontSize: "12px",
      },
    },
    {
      name: "MATTER LABS",
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "0.1em",
        fontSize: "12px",
      },
    },
    {
      name: "DEXTOOLS",
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "0.06em",
        fontSize: "12px",
      },
    },
    {
      name: "NGRAVE",
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "0.18em",
        fontSize: "12px",
      },
    },
    {
      name: "POLYCHAIN",
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "0.14em",
        fontSize: "12px",
      },
    },
  ];

  return (
    <section className="bg-background px-lg py-xl w-full overflow-hidden">
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
          <p className="text-text-secondary text-[20px] leading-relaxed font-semibold font-serif italic max-w-118 ">
            Backed by institutional
            <br />
            partners and custody networks.
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
                className="mx-lg shrink-0 text-zinc-500 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-150"
                style={backer.style}
              >
                {backer.name}
              </span>
            ))}
            {/* Second loop */}
            {backers.map((backer, idx) => (
              <span
                key={`backer-2-${backer.name}`}
                className="mx-lg shrink-0 text-zinc-500 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-150"
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
