import { requireRole } from "@/lib/guards";
import {
  getResourcesByRoleAndCategory,
} from "@/lib/externalResources";
import ExternalResourceCard from "@/components/ExternalResourceCard";

export const dynamic = "force-dynamic";

export default async function WarehouseFindWorkersPage() {
  await requireRole("warehouse");

  const resources = getResourcesByRoleAndCategory(
    "warehouse",
    "workers"
  );

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-3xl font-semibold">
          Find workers
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Discover platforms to hire warehouse and logistics workers
        </p>

        <div className="flex gap-2 mt-3">
          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            Sweden
          </span>

          <span className="text-xs text-gray-400">
            {resources.length} platforms available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((r) => (
          <ExternalResourceCard key={r.id} {...r} />
        ))}
      </div>

    </div>
  );
}
