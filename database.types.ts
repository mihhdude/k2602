export interface PlayerData {
  id: number;
  governor_id: string;
  governor_name: string;
  power: number;
  kill_points: number;
  deads: number;
  total_deads: number;
  t1_kills: number;
  t2_kills: number;
  t3_kills: number;
  t4_kills: number;
  t5_kills: number;
  phase: string;
  created_at: string;
}

export interface PlayerStatus {
  id: number;
  governor_id: string;
  governor_name: string;
  on_leave: boolean;
  zeroed: boolean;
  farm_account: boolean;
  blacklisted: boolean;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  event_type: string;
  start_date: string;
  end_date: string;
  description: string | null;
  created_at: string;
} 
