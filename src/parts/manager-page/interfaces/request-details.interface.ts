export interface RequestDetails {
  id: number;
  created_at: string;
  client_id: number;
  contract_number: string;
  status: string;
  summary: number;
  septic_id: number;
  planed_start_time: string;
  planed_start_date: string;
  client: Client;
  septic: Septic;
  services: Service[];
}

export interface Client {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  phone_number: string;
}

export interface Septic {
  id: number;
  model: string;
  volume: number;
}

export interface Service {
  service_id: number;
  amount: number;
  name: string;
}
