import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
export async function GET() {
  try {
    const html = await fs.readFile(path.join(process.cwd(), "public", "calendario", "index.html"), "utf-8");
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}