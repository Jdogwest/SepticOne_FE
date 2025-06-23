export interface RequestFormData {
  services: ServiceItem[];
  status: string | null;
  date: Date | null;
  time: string | null;
  brigade: string | null;
  comment: string | null;
  contractNumber: string | null;
  work_comment: string | null;
}

export interface ServiceItem {
  service_id: number;
  amount: number;
  
}
