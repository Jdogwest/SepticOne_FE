export interface MyRequest {
  id: number;
  created_at: string;
  client_id: number;
  contract_number: string;
  status: string;
  summary: number;
  septic_id: number;
  planed_start_time: string;
  planed_start_date: string;
  client: {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    phone_number: string;
  };
  septic: {
    id: number;
    model: string;
    volume: number;
  };
  services: {
    service_id: number;
    amount: number;
    name: string;
  }[];
}
