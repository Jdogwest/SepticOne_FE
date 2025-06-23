export interface Day {
  date: Date | null;
  brigadsStatus?: BrigadStatus[];
  busy?: boolean;
}

export interface BrigadStatus {
  request_id: number;
  brigadId: number;
  brigadSurname: string;
  brigadName: string;
  brigadPatronymic: string;
  busyTimes: string[];
}
