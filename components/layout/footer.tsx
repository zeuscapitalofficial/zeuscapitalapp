"use client"

import Link from "next/link";
import { LogoIcon } from "../ui/logo";

export function Footer() {
  return (
    <footer
      className="site-footer relative z-100 overflow-hidden bg-[#000000] text-[#ffffff] font-sans antialiased"
      style={{
        fontFamily: '"Geist", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        textRendering: "geometricPrecision",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Animated Dots Strip */}
      <div
        className="footer-dots relative h-30 overflow-hidden bg-[#000000]"
        aria-hidden="true"
      >
        <div
          className="footer-dots__line absolute left-0 top-1/2 w-50 h-17.5 opacity-75"
          style={{
            width: "200%",
            transform: "translateY(-50%)",
            backgroundImage: `
              radial-gradient(circle, rgb(255 255 255 / 0.55) 1.5px, transparent 2px),
              radial-gradient(circle, rgb(255 255 255 / 0.35) 1px, transparent 1.5px),
              radial-gradient(circle, rgb(255 255 255 / 0.45) 1.2px, transparent 1.8px)
            `,
            backgroundPosition: "0 8px, 24px 22px, 48px 14px",
            backgroundSize: "72px 38px, 110px 44px, 160px 52px",
            animation: "footerDotsMove 18s linear infinite",
          }}
        />
      </div>

      {/* Footer Inner Container */}
      <div
        className="site-footer__inner mx-auto"
        style={{
          width: "min(100% - 96px, 1820px)",
          padding: "clamp(34px, 4vw, 66px) 0 clamp(18px, 2vw, 34px)",
        }}
      >
        {/* Top Grid */}
        <div
          className="site-footer__top grid gap-[clamp(28px,4vw,76px)]"
          style={{
            gridTemplateColumns: "minmax(320px, 1.25fr) repeat(3, minmax(150px, 0.42fr))",
            minHeight: "clamp(220px, 24vw, 330px)",
          }}
        >
          {/* H2 Propulsion Message */}
          <h2
            className="m-0 text-white font-extralight text-left leading-[1.06]"
            style={{
              maxWidth: "680px",
              fontSize: "clamp(34px, 3.5vw, 62px)",
              letterSpacing: "0",
              fontWeight: 220,
            }}
          >
            Institutional capital.
            <br />
            Compounded precisely.
          </h2>

          {/* Navigation Column 1 */}
          <nav
            className="site-footer__nav flex flex-col items-start gap-[clamp(14px,1.35vw,22px)]"
            aria-label="Products navigation"
          >
            <Link
              href="/pricing"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              Mining Plans
            </Link>
            <Link
              href="/features"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              Platform Features
            </Link>
            <Link
              href="/pricing"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              OTC Brokerage
            </Link>
            <Link
              href="/about"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              Private Custody
            </Link>
          </nav>

          {/* Navigation Column 2 */}
          <nav
            className="site-footer__nav flex flex-col items-start gap-[clamp(14px,1.35vw,22px)]"
            aria-label="Company links"
          >
            <Link
              href="/about"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              About Us
            </Link>
            <Link
              href="/faq"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              Help Center
            </Link>
            <Link
              href="/contact"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              Contact Us
            </Link>
            <Link
              href="/sign-in"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              Client Portal
            </Link>
          </nav>

          {/* Navigation Column 3 */}
          <nav
            className="site-footer__nav flex flex-col items-start gap-[clamp(14px,1.35vw,22px)]"
            aria-label="Social links"
          >
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="text-[rgb(255_255_255/0.88)] text-[16px] font-semibold leading-[1.1] transition-all duration-180 ease-out hover:text-white hover:translate-x-0.75"
            >
              Follow Us on X
            </a>
          </nav>
        </div>

        {/* Brand Row */}
        <div className="site-footer__brand-row w-full mt-[clamp(18px,3vw,46px)]">
          <Link
            href="/"
            className="site-footer__brand flex items-center w-full text-white hover:opacity-95"
            aria-label="Zeus Capital home"
          >
            {/* Brand Mark Circle */}
            <LogoIcon className="mr-6" size={130} />

            {/* Brand Wordmark text */}
            <span
              className="block flex-[1_1_auto] min-w-0 text-[clamp(58px,11.1vw,214px)] font-bold tracking-[-0.055em] leading-[0.78] white-space-nowrap"
              style={{
                fontWeight: 760,
                letterSpacing: "-0.055em",
                whiteSpace: "nowrap",
              }}
            >
              Zeus Capital
            </span>
          </Link>
        </div>

        {/* Legal Line */}
        <div className="site-footer__legal flex flex-row flex-wrap justify-start gap-[8px_18px] mt-[clamp(14px,1.4vw,24px)] text-[rgb(255_255_255/0.52)] text-[9px] leading-[1.35]">
          <p className="m-0">© 2026 Zeus Capital. All rights reserved.</p>
          <a href="#privacy" className="text-inherit hover:text-white transition-colors duration-150">
            Privacy Policy
          </a>
          <a href="#terms" className="text-inherit hover:text-white transition-colors duration-150">
            Terms of Use
          </a>
        </div>
      </div>

      {/* Responsive Breakpoint Styles Injection */}
      <style jsx global>{`
        @media (max-width: 980px) {
          .site-footer__inner {
            width: min(100% - 48px, 1820px) !important;
          }
          .site-footer__top {
            grid-template-columns: 1fr 1fr !important;
          }
          .site-footer__top h2 {
            grid-column: 1 / -1 !important;
          }
        }
        @media (max-width: 560px) {
          .site-footer__inner {
            width: min(100% - 32px, 1820px) !important;
          }
          .site-footer__top {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .site-footer__nav a {
            font-size: 15px !important;
          }
          .site-footer__mark {
            flex: 0 0 clamp(38px, 12vw, 58px) !important;
          }
          .site-footer__brand span:last-child {
            font-size: clamp(45px, 18vw, 84px) !important;
          }
        }
      `}</style>
    </footer>
  );
}
