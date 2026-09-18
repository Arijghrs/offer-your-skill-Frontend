import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
function LanguageSwitcher({ className }) {
  const { lang, setLang, t } = useI18n();
  const active = languages.find((l) => l.code === lang);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1.5", className)}
          aria-label={t("nav.language")}
        >
          <Globe className="size-4" />
          <span className="text-xs font-semibold uppercase">{active?.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t("nav.language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLang(l.code)}
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{l.flag}</span>
              {l.native}
            </span>
            {l.code === lang && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export { LanguageSwitcher };
