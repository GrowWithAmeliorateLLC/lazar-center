// Server-side relay: careers resume upload -> GoHighLevel media library.
const ALLOWED = ["https://lazarcenter.com", "https://www.lazarcenter.com", "https://lazar-center.netlify.app"];
const MAX = 10 * 1024 * 1024;
const OK_EXT = /\.(pdf|docx?)$/i;

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED.includes(origin) || /--lazar-center\.netlify\.app$/.test(origin || "") ? origin : ALLOWED[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Version",
  "Content-Type": "application/json",
});

export default async (req) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "method" }), { status: 405, headers: cors(origin) });
  const pit = process.env.GHL_PIT_LAZAR;
  if (!pit) return new Response(JSON.stringify({ error: "not configured" }), { status: 500, headers: cors(origin) });

  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return new Response(JSON.stringify({ error: "no file" }), { status: 400, headers: cors(origin) });
  if (file.size > MAX || !OK_EXT.test(file.name || "")) return new Response(JSON.stringify({ error: "file type or size" }), { status: 400, headers: cors(origin) });

  const out = new FormData();
  out.append("file", file, file.name);
  out.append("hosted", "false");
  out.append("name", file.name);
  const res = await fetch("https://services.leadconnectorhq.com/medias/upload-file", {
    method: "POST",
    headers: { Authorization: "Bearer " + pit, Version: "2021-07-28" },
    body: out,
  });
  return new Response(await res.text(), { status: res.status, headers: cors(origin) });
};

export const config = { path: "/api/media" };
