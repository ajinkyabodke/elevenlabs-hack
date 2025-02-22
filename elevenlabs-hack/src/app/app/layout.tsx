export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
