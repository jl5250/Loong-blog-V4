import { getPageConfig } from "@/api/config";
import type { Metadata } from "next";
import { EquipmentCard } from "@/components/ui/EquipmentCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "设备",
  description: "Loong·Blog 的设备清单 — 工欲善其事，必先利其器",
};

interface EquipmentItem {
  name: string;
  description: string;
  price: string | number;
  image: string;
  color?: string;
}

interface EquipmentGroup {
  category: string;
  description: string;
  items: EquipmentItem[];
}

export default async function EquipmentPage() {
  let groups: EquipmentGroup[] = [];

  try {
    const res = await getPageConfig<{ list: EquipmentGroup[] }>("equipment");
    if (res.code === 200 && res.data?.value?.list) {
      groups = res.data.value.list.map((g) => ({
        ...g,
        items: (g.items ?? []).map((item) => ({
          name: item.name || "未命名设备",
          image: item.image || "",
          price: item.price ?? "0",
          description: item.description || "暂无描述",
          color: item.color || "#2a2a3a",
        })),
      }));
    }
  } catch {}

  return (
    <main className="flex-1 pt-24 sm:pt-28 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute top-1/3 right-[-10%] w-80 h-80 rounded-full bg-accent2/4 blur-[100px]" />
        <div className="absolute bottom-1/4 left-[-10%] w-80 h-80 rounded-full bg-accent/4 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-calligraphy text-6xl md:text-7xl text-text-muted/10 mb-4 block">器</span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">设备</h1>
          <p className="font-kai text-text-muted">Equipment · 工欲善其事，必先利其器</p>
        </div>

        {groups.length > 0 ? (
          <div className="space-y-20">
            {groups.map((group, i) => (
              <section key={i}>
                {/* Category header */}
                <div className="mb-8 pb-4 border-b border-border flex flex-col md:flex-row md:items-end justify-between">
                  <div>
                    <h2 className="font-serif font-bold text-2xl md:text-3xl text-text-body tracking-tight">
                      {group.category}
                    </h2>
                    {group.description && (
                      <p className="font-kai text-sm text-text-muted mt-1">{group.description}</p>
                    )}
                  </div>
                </div>

                {/* Equipment grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {group.items.map((item, idx) => (
                    <EquipmentCard key={idx} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <span className="font-calligraphy text-6xl text-text-muted/10">空</span>
            <p className="font-kai text-text-muted mt-4">暂无设备数据</p>
          </div>
        )}
      </div>
    </main>
  );
}
