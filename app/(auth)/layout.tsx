export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black flex items-center justify-center">
      {children}
    </div>
  );
}
