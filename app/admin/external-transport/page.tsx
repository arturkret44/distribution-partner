import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { addExternalCompany } from "./actions";

export const dynamic = "force-dynamic";

export default async function ExternalTransportAdminPage() {
  await requireRole("admin");

  const supabase = await supabaseServer();

  const { data: companies } = await supabase
    .from("external_transport_companies")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>
        External transport companies
      </h1>

      <form action={addExternalCompany} style={{ marginTop: 30, maxWidth: 600 }}>

        <h3>Add new company</h3>

        <input
          name="company_name"
          placeholder="Company name"
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          name="region"
          placeholder="Region (exact name as in filters)"
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          name="kommuner"
          placeholder="Kommuner (comma separated)"
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label>
          <input type="checkbox" name="has_refrigerated" /> Refrigerated
        </label>

        <input
          name="phone"
          placeholder="Phone"
          style={{ width: "100%", padding: 8, marginBottom: 10, marginTop: 10 }}
        />

        <input
          name="email"
          placeholder="Email"
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          name="website"
          placeholder="Website"
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <textarea
          name="description"
          placeholder="Description"
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            background: "#15803d",
            color: "white",
            borderRadius: 6,
          }}
        >
          Add company
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h3>Existing companies</h3>

      {!companies || companies.length === 0 ? (
        <p>No external companies yet.</p>
      ) : (
        <ul>
          {companies.map((c) => (
            <li key={c.id} style={{ marginBottom: 20 }}>
              <b>{c.company_name}</b>
              <div>{c.region}</div>
              <div>{(c.kommuner || []).join(", ")}</div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 30 }}>
        <a href="/admin" style={{ color: "#15803d" }}>
          ← Back to admin panel
        </a>
      </div>
    </main>
  );
}
