export default function ResumeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      {children}
    </div>
  );
} 