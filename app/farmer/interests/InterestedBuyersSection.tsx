"use client";

import React from "react";
import { updateInterestStatus, closeDeal } from "./actions";

export default function InterestedBuyersSection({
  grouped,
  td,
}: any) {
const [open, setOpen] = React.useState({
  pending: true,
  contacted: true,
  agreed: true,
  rejected: true,
});

function row(i:any, td:any){
return (
<>
<td style={td}>
<a
href={`/announcements/${i.announcement_id}`}
style={{ color:"#166534", fontWeight:500 }}
>
{i.product_name}
</a>

<span
style={{
marginLeft:8,
padding:"2px 8px",
borderRadius:999,
fontSize:11,
background:i.announcement_type === "surplus"
? "#fef3c7"
: "#dcfce7",
}}
>
{i.announcement_type}
</span>
</td>

<td style={td}>
{i.price_negotiable ? "negotiable" : `${i.price} SEK`}
</td>

<td style={td}>
<a
href={`/profiles/${i.buyer_id}`}
style={{ color:"#1d4ed8", fontWeight:500 }}
>
{i.buyer_company_name}
</a>
</td>

<td style={td}>
{i.offered_price ? `${i.offered_price} SEK` : "—"}
</td>

<td style={td}>
<div style={{ display:"flex", alignItems:"center", gap:8 }}>

<form action={updateInterestStatus} style={{ display: "flex", gap: 6 }}>
<input type="hidden" name="interest_id" value={i.interest_id} />

<select
name="status"
defaultValue={i.status}
style={{
padding: "4px 6px",
borderRadius: 6,
border: "1px solid #e5e7eb",
fontSize: 12
}}
>
<option value="pending">pending</option>
<option value="contacted">contacted</option>
<option value="agreed">agreed</option>
<option value="rejected">rejected</option>
</select>

<button
type="submit"
style={{
background: "#166534",
color: "white",
border: "none",
borderRadius: 6,
padding: "4px 10px",
fontSize: 12,
cursor: "pointer"
}}
>
Update
</button>

</form>
{i.status === "agreed" && (
<form action={closeDeal}>
<input type="hidden" name="interest_id" value={i.interest_id} />

<button
type="submit"
style={{
background:"#1d4ed8",
color:"white",
border:"none",
borderRadius:6,
padding:"4px 10px",
fontSize:12,
cursor:"pointer"
}}
>
Close deal
</button>

</form>
)}

</div>
</td>

<td style={td}>
{new Date(i.created_at).toLocaleDateString()}
</td>
</>
)
}
type StatusKey = "pending" | "contacted" | "agreed" | "rejected";
function toggle(key: StatusKey){
  setOpen(prev => ({ ...prev, [key]: !prev[key] }));
}

return (
<tbody>

{/* NEW */}
{grouped.pending.length > 0 && (
<>
<tr
onClick={() => toggle("pending")}
style={{ background:"#f8fafc", cursor:"pointer", height: 50 }}
>
<td colSpan={6} style={{ ...td, fontWeight:600 }}>
{open.pending ? "▼" : "▶"} New interests ({grouped.pending.length})
</td>
</tr>

{open.pending && grouped.pending.map((i:any)=>(
<tr key={i.interest_id} style={{ borderBottom:"1px solid #e5e7eb" }}>
{row(i, td)}
</tr>
))}
</>
)}

{/* CONTACTED */}
{grouped.contacted.length > 0 && (
<>
<tr
onClick={() => toggle("contacted")}
style={{ background:"#fff7ed", cursor:"pointer", height: 50 }}
>
<td colSpan={6} style={{ ...td, fontWeight:600 }}>
{open.contacted ? "▼" : "▶"} Contacted ({grouped.contacted.length})
</td>
</tr>

{open.contacted && grouped.contacted.map((i:any)=>(
<tr key={i.interest_id} style={{ borderBottom:"1px solid #e5e7eb" }}>
{row(i, td)}
</tr>
))}
</>
)}

{/* AGREED */}
{grouped.agreed.length > 0 && (
<>
<tr
onClick={() => toggle("agreed")}
style={{ background:"#f0fdf4", cursor:"pointer", height: 50 }}
>
<td colSpan={6} style={{ ...td, fontWeight:600 }}>
{open.agreed ? "▼" : "▶"} Agreed ({grouped.agreed.length})
</td>
</tr>

{open.agreed && grouped.agreed.map((i:any)=>(
<tr key={i.interest_id} style={{ borderBottom:"1px solid #e5e7eb" }}>
{row(i, td)}
</tr>
))}
</>
)}

{/* REJECTED */}
{grouped.rejected.length > 0 && (
<>
<tr
onClick={() => toggle("rejected")}
style={{ background:"#fef2f2", cursor:"pointer", height: 50 }}
>
<td colSpan={6} style={{ ...td, fontWeight:600 }}>
{open.rejected ? "▼" : "▶"} Rejected ({grouped.rejected.length})
</td>
</tr>

{open.rejected && grouped.rejected.map((i:any)=>(
<tr key={i.interest_id} style={{ borderBottom:"1px solid #e5e7eb", opacity:0.6 }}>
{row(i, td)}
</tr>
))}
</>
)}

</tbody>
);
}
