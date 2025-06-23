export interface CallRequest {
  id: number;
  fio: string;
  phone_number: string;
  comment: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
}
