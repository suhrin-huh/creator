export interface Meeting {
  id?: string;
  subject: string;
  duration: number;
  start_time: string;
  location: string;
  members: string[];
}
