import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

const IMAGE_MAP: Record<string, string> = {
  "nissan-note-nismo":
    "C:\\Users\\Admin\\.cursor\\projects\\c-Users-Admin-OneDrive-Documents-Projects-code-Car-bazaar\\assets\\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_59ad2bfdcb1b45213b9490bb601e8295_images_image-1ec67b84-269d-4109-8065-c7925f9c9cbb.png",
  "bmw-m5":
    "C:\\Users\\Admin\\.cursor\\projects\\c-Users-Admin-OneDrive-Documents-Projects-code-Car-bazaar\\assets\\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_59ad2bfdcb1b45213b9490bb601e8295_images_image-fc28513c-5cac-4f34-aae1-e35bbdd89111.png",
  "mercedes-cls-63":
    "C:\\Users\\Admin\\.cursor\\projects\\c-Users-Admin-OneDrive-Documents-Projects-code-Car-bazaar\\assets\\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_59ad2bfdcb1b45213b9490bb601e8295_images_image-88d0cae0-38bb-409b-8cc9-ea7c59dc91ec.png",
  tesla:
    "C:\\Users\\Admin\\.cursor\\projects\\c-Users-Admin-OneDrive-Documents-Projects-code-Car-bazaar\\assets\\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_59ad2bfdcb1b45213b9490bb601e8295_images_image-27701ec1-2d85-4516-b549-cbf22c152b7b.png",
  porsche:
    "C:\\Users\\Admin\\.cursor\\projects\\c-Users-Admin-OneDrive-Documents-Projects-code-Car-bazaar\\assets\\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_59ad2bfdcb1b45213b9490bb601e8295_images_image-f24d52ff-83c9-4a13-8e20-d5bb78403e31.png",
  "vw-golf-gti":
    "C:\\Users\\Admin\\.cursor\\projects\\c-Users-Admin-OneDrive-Documents-Projects-code-Car-bazaar\\assets\\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_59ad2bfdcb1b45213b9490bb601e8295_images_image-1e220bba-7bdd-4198-af1f-5c23d2d8c7b4.png",
};

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const filePath = IMAGE_MAP[slug];
    if (!filePath) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load asset" }, { status: 500 });
  }
}
