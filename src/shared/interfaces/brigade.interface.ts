export interface Workman {
  id: number;
  name: string;
  surname?: string;
  patronymic?: string;
}

export interface Brigade {
  brigadier_id: number;
  title: string;
  workmen: Workman[];
}

export interface BrigadeUpdatePayload {
  brigadier_id: number;
  workman_ids: number[];
}
