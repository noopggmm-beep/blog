import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "yyyy 年 MM 月 dd 日", { locale: zhCN });
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "yyyy-MM-dd");
  } catch {
    return dateString;
  }
}
