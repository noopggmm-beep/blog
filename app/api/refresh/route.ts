import { exec } from "child_process";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await new Promise<void>((resolve, reject) => {
      exec(
        "node scripts/generate-daily-news.js",
        { cwd: process.cwd(), timeout: 120000 },
        (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });
    return NextResponse.json({ ok: true, time: new Date().toISOString() });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
