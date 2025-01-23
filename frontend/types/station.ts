export interface Station {
  id: string;
  name: string;
  zone: string;
  latitude: number;
  longitude: number;
  connections?: Array<{
    station: string;
    line: string;
  }>;
}
