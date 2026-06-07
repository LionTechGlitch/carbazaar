import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/** Basic image upload: accepts multipart/form-data with field "file" or base64 in JSON */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contentType = req.headers.get("content-type") || "";
    let url: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name) || ".jpg";
      const filename = `car-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      await mkdir(UPLOAD_DIR, { recursive: true });
      const filepath = path.join(UPLOAD_DIR, filename);
      await writeFile(filepath, buffer);
      url = `/uploads/${filename}`;
    } else {
      const body = await req.json();
      const { base64, filename: name } = body;
      if (!base64) return NextResponse.json({ error: "No base64 or file provided" }, { status: 400 });
      const buffer = Buffer.from(base64, "base64");
      const ext = path.extname(name || "") || ".jpg";
      const filename = `car-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      await mkdir(UPLOAD_DIR, { recursive: true });
      await writeFile(path.join(UPLOAD_DIR, filename), buffer);
      url = `/uploads/${filename}`;
    }

    return NextResponse.json({ url, message: "Upload successful" });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
