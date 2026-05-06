import { promises as fs } from "fs";
import path from "path";

export const metadata = { title: "개인정보처리방침 - 이음" };

export default async function PrivacyPage() {
  const md = await fs.readFile(
    path.join(process.cwd(), "app/legal/privacy/content.md"),
    "utf-8"
  );
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="whitespace-pre-wrap leading-relaxed text-zinc-800">{md}</article>
    </main>
  );
}
