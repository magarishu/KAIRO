import { LucideIcon } from "lucide-react";

export interface SlaveAccount {
  id: string;
  name: string;
  accountId?: string;
  broker?: string;
  status: string;
  balance: string;
  pnl?: string;
  pnlColor?: string;
  multiplier?: number;
  copySl?: boolean;
  copyTp?: boolean;
}

export interface Group {
  id: string;
  name: string;
  accountId?: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  accountsCount: number;
  balance: string;
  pnl: string;
  pnlColor?: string;
  status?: string;
  slaves: SlaveAccount[];
}
