import { promises as fs } from "fs";
import path from "path";

export const metadata = { title: "이용약관 - 이음" };

export default async function TermsPage() {
  const md = await fs.readFile(
    path.join(process.cwd(), "app/legal/terms/content.md"),
    "utf-8"
  );
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="whitespace-pre-wrap leading-relaxed text-zinc-800">{md}</article>
    </main>
  );
}
