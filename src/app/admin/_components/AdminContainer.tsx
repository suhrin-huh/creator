// components
import DailyViewChart from "./DailyViewChart";
import QuickActions from "./QuickActions";

export default function AdminContainer() {
  return (
    <main className="bg-primary flex flex-1 flex-col gap-6 p-6">
      <DailyViewChart />
      <QuickActions />
      {/* Placeholder */}
      <section className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-gray-400 shadow-sm">
        Section 준비 중
      </section>
    </main>
  );
}
