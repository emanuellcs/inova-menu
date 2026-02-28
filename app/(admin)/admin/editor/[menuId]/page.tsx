import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMenuForEditor } from "@/lib/actions";
import { MenuEditor } from "@/components/admin/editor/MenuEditor";

interface EditorPageProps {
  params: Promise<{ menuId: string }>;
}

export async function generateMetadata({
  params,
}: EditorPageProps): Promise<Metadata> {
  const { menuId } = await params;
  const result = await getMenuForEditor(menuId);
  return {
    title: `Editando: ${result.data?.name || "Cardápio"}`,
  };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { menuId } = await params;
  const result = await getMenuForEditor(menuId);

  if (result.error || !result.data) {
    notFound();
  }

  return <MenuEditor initialMenu={result.data} />;
}
