export interface MenuItem {
  icon?: string;
  title: string;
  routerName?: string;
  children?: MenuItem[];
}

export function formatDate (date: string): string {
  const localDate: Date = new Date(date)
  return `${localDate.getFullYear()}-` +
    `${(localDate.getMonth() < 9) ? `0${localDate.getMonth() + 1}` : localDate.getMonth() + 1}-` +
    `${(localDate.getDate() < 10) ? `0${localDate.getDate()}` : localDate.getDate()}`
}
