import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteAgendaButton } from "@/components/admin/delete-agenda-button";

export default async function KelolaAgendaPage() {
  const supabase = await createClient();
  const { data: agendaList } = await supabase
    .from("agenda")
    .select("*")
    .order("tanggal_mulai", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Kelola Agenda</h1>
        <Link href="/admin/agenda/baru">
          <Button>+ Tambah Agenda</Button>
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-accent/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Kegiatan</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {agendaList?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-foreground/50">
                  Belum ada agenda.
                </td>
              </tr>
            )}
            {agendaList?.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{a.judul_kegiatan}</td>
                <td className="px-4 py-3">{a.kategori && <Badge className="bg-secondary">{a.kategori}</Badge>}</td>
                <td className="px-4 py-3 text-foreground/70">
                  {new Date(a.tanggal_mulai).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteAgendaButton id={a.id} judul={a.judul_kegiatan} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
