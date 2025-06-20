export interface ServicesFormData {
  service: { id: string; quantity: number }[];
  quantity: number | null;
  date: Date | null;
  time: string | null;
  comment: string | null;
}
