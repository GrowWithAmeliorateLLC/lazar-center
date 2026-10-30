// Server-side relay: website forms -> GoHighLevel contacts (upsert).
// The GHL key lives only in the Netlify env var GHL_PIT_LAZAR, never in page code.
const LOCATION_ID = "0KwklRHSqUzG0TFYIJCx";
const ALLOWED = ["https://lazarcenter.com", "https://www.lazarcenter.com", "https://lazar-center.netlify.app"];

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED.includes(origin) || /--lazar-center\.netlify\.app$/.test(origin || "") ? origin : ALLOWED[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Version, Accept",
  "Content-Type": "application/json",
});

export default async (req) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "method" }), { status: 405, headers: cors(origin) });
  const pit = process.env.GHL_PIT_LAZAR;
  if (!pit) return new Response(JSON.stringify({ error: "not configured" }), { status: 500, headers: cors(origin) });

  let body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers: cors(origin) }); }

  // Honeypot / minimum fields
  if (body.website || body._gotcha) return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors(origin) });
  if (!body.email && !body.phone) return new Response(JSON.stringify({ error: "email or phone required" }), { status: 400, headers: cors(origin) });

  const allowed = ["firstName", "lastName", "name", "email", "phone", "source", "tags", "customFields", "address1", "city", "state", "postalCode"];
  const payload = { locationId: LOCATION_ID };
  for (const k of allowed) if (body[k] !== undefined) payload[k] = body[k];
  if (!Array.isArray(payload.tags)) payload.tags = [];
  payload.tags.push("website-lazarcenter");

  const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
    method: "POST",
    headers: { Authorization: "Bearer " + pit, Version: "2021-07-28", "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: cors(origin) });
};

export const config = { path: "/api/lead" };
