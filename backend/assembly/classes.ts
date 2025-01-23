@json
/**
 * A London Underground Station
 */
export class Station {
  id!: string;
  name!: string;
  latitude: f32 = 0.0;
  longitude: f32 = 0.0;
  zone: string = '';
  connections: Connection[] = [];

  constructor(id: string, name: string, latitude: f32, longitude: f32, zone: string) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.zone = zone;
  }
}

@json
/**
 * A connection between two stations
 */
export class Connection {
  toStation!: string; // station id
  line!: string; // tube line name (e.g. "PICCADILLY", "VICTORIA")

  constructor(toStation: string, line: string) {
    this.toStation = toStation;
    this.line = line;
  }
}

@json
/**
 * Results of a station search, includes station details and a similarity score
 */
export class StationResult {
  station!: Station;
  score: f32 = 0.0;

  constructor(station: Station, score: f32) {
    this.station = station;
    this.score = score;
  }
}
