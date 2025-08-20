import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  description?: string;
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
}

function isPhone(v: string) {
  return /^\+?\d{10,15}$/.test(v);
}

type AnyRecord = object;

async function appendJson<T extends AnyRecord>(file: string, item: T) {
  try {
    const buf = await fs.readFile(file, "utf8");
    const arr = JSON.parse(buf || "[]");
    if (!Array.isArray(arr)) throw new Error("Invalid data store");
    arr.push({ ...(item as AnyRecord), createdAt: new Date().toISOString() });
    await fs.writeFile(file, JSON.stringify(arr, null, 2), "utf8");
  } catch (e: any) {
    if (e?.code === "ENOENT") {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(
        file,
        JSON.stringify([{ ...(item as AnyRecord), createdAt: new Date().toISOString() }], null, 2),
        "utf8"
      );
      return;
    }
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;
    if (!body?.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!isEmail(body.email)) return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    if (!isPhone(body.phone)) return NextResponse.json({ error: "Valid phone is required" }, { status: 400 });

    const dataDir = path.join(process.cwd(), "data");
    const file = path.join(dataDir, "contacts.json");
    await appendJson(file, body);

    return NextResponse.json({ ok: true, message: "Contact submitted" });
  } catch (e) {
    return NextResponse.json({ error: "Failed to process contact" }, { status: 500 });
  }
}
