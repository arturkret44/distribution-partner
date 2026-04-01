"use client";

import { submitTransportForm } from "./reply";

export default function TransportForm({ requestId }: { requestId: string }) {
  return (
    <form action={submitTransportForm} className="space-y-4">
      <input type="hidden" name="request_id" value={requestId} />

      <div>
        <label className="block text-sm">Pickup location:</label>
        <input name="pickup_location" required className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block text-sm">Delivery location:</label>
        <input name="delivery_location" required className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block text-sm">Pickup date:</label>
        <input type="date" name="pickup_date" required className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block text-sm">Delivery date:</label>
        <input type="date" name="delivery_date" required className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block text-sm">Cargo type:</label>
        <input name="cargo_type" className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block text-sm">Weight:</label>
        <input type="number" step="0.01" name="cargo_weight" className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block text-sm">Pallets:</label>
        <input type="number" name="pallets_count" className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block text-sm">Notes:</label>
        <textarea name="transport_notes" className="border p-2 rounded w-full" />
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Submit transport details
      </button>
    </form>
  );
}
