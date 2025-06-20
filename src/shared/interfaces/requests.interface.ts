export interface AddRequestPayload {
  planed_start_date: string;
  planed_start_time: string;
  comment: string;
  services: ServiceItem[];
}

export interface ServiceItem {
  service_id: number;
  amount: number;
}
