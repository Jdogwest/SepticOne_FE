export interface BusyDateResponse {
  date: string;
  busy_brigadiers: {
    request_id: number;
    id: number;
    surname: string;
    name: string;
    patronymic: string;
    busy_times?: string[];
  }[];
}
