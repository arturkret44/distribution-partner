import { requireRole } from "@/lib/guards";
import {
  getResourcesByRoleAndCategory,
} from "@/lib/externalResources";
import ExternalResourceCard from "@/components/ExternalResourceCard";

export const dynamic = "force-dynamic";

export default async function FindWorkersPage() {
  await requireRole("farmer");

  const resources = getResourcesByRoleAndCategory(
    "farmer",
    "workers"
  );

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">
          Find workers
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Discover trusted platforms to hire seasonal workers in Sweden
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {resources.map((r) => (
          <ExternalResourceCard
            key={r.id}
            title={r.title}
            description={r.description}
            href={r.href}
            icon={r.icon}
          />
        ))}

      </div>
    </div>
  );
}
