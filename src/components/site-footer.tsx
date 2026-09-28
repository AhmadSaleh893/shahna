import Link from "next/link";
import { BoltIcon, WhatsAppIcon } from "./icons";
import { getI18n } from "@/lib/i18n/server";
import { site } from "@/lib/site";
import { CATEGORIES } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";

export async function SiteFooter() {
  const { t } = await getI18n();
  const chat = whatsappLink(t.footer.chatMessage);
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="flex items-center gap-2 text-lg font-bold">
            <span className="flex size-8 items-center justify-center rounded-full bg-volt text-ink">
              <BoltIcon width={16} height={16} />
            </span>
            {t.site.name}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-paper/65">{t.site.description}</p>
          {chat && (
            <a href={chat} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-6">
              <WhatsAppIcon /> {t.footer.chat}
            </a>
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-paper/50">{t.footer.shop}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/bikes" className="hover:text-volt">
                {t.nav.allBikes}
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/bikes?category=${c}`} className="hover:text-volt">
                  {t.categories[c]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-paper/50">{t.footer.visit}</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
            <li>{t.site.city}</li>
            <li>{t.site.hours}</li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-volt" dir="ltr">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-paper/45 sm:px-6">
          © {new Date().getFullYear()} {t.site.name}. {t.footer.vat}
        </p>
      </div>
    </footer>
  );
}
