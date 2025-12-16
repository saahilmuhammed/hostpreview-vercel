import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { domain, ip, path = "/" } = await req.json();

    if (!domain || !ip) {
      return NextResponse.json(
        { error: "Domain and IP are required" },
        { status: 400 }
      );
    }

    const upstreamUrl = `http://${ip}${path}`;

    const upstreamRes = await fetch(upstreamUrl, {
      headers: {
        Host: domain,
        "User-Agent": "Mozilla/5.0 (HostPreview)",
        Accept: "*/*",
      },
      redirect: "manual",
    });

    let body = await upstreamRes.text();
    const contentType =
      upstreamRes.headers.get("content-type") || "text/html";

    // Fix relative assets
    if (contentType.includes("text/html")) {
      body = body.replace(
        "<head>",
        `<head><base href="http://${ip}/">`
      );
    }

    return new Response(body, {
      status: upstreamRes.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    console.error("Upstream fetch failed:", err);
    return new Response("Upstream fetch failed", { status: 502 });
  }
}
