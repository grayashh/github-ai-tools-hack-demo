import { neo4j } from '@hypermode/modus-sdk-as';
import { Connection, Station } from './classes';
import { JSON } from 'json-as';

const hostName = 'neo4j';

/**
 * Get all stations from Neo4j
 */
export function getAllStations(): Station[] {
  const query = `
  MATCH (s:Station)
  RETURN s.name AS name, 
         s.latitude AS latitude, 
         s.longitude AS longitude,
         s.zone AS zone,
         ID(s) AS id
  ORDER BY s.name`;

  const result = neo4j.executeQuery(hostName, query);
  const stations: Station[] = [];

  for (let i = 0; i < result.Records.length; i++) {
    const record = result.Records[i];
    const name = record.getValue<string>('name');
    const latitude = record.getValue<f32>('latitude');
    const longitude = record.getValue<f32>('longitude');
    const zone = record.getValue<string>('zone');
    const id = record.getValue<string>('id');

    stations.push(new Station(id, name, latitude, longitude, zone));
  }

  return stations;
}

/**
 * Search stations by name
 */
export function searchStations(searchTerm: string, limit: i32 = 20): Station[] {
  const vars = new neo4j.Variables();
  vars.set('searchTerm', searchTerm.toLowerCase());
  vars.set('limit', limit);

  const query = `
  MATCH (s:Station)
  WHERE toLower(s.name) CONTAINS $searchTerm
  RETURN s.name AS name,
         s.latitude AS latitude,
         s.longitude AS longitude, 
         s.zone AS zone,
         ID(s) AS id
  LIMIT toInteger($limit)`;

  const result = neo4j.executeQuery(hostName, query, vars);
  const stations: Station[] = [];

  for (let i = 0; i < result.Records.length; i++) {
    const record = result.Records[i];
    const name = record.getValue<string>('name');
    const latitude = record.getValue<f32>('latitude');
    const longitude = record.getValue<f32>('longitude');
    const zone = record.getValue<string>('zone');
    const id = record.getValue<string>('id');

    stations.push(new Station(id, name, latitude, longitude, zone));
  }

  return stations;
}

/**
 * Get station details including connections
 */
export function getStationDetails(stationName: string): Station | null {
  const vars = new neo4j.Variables();
  vars.set('name', stationName);

  const query = `
  MATCH (s:Station {name: $name})
  OPTIONAL MATCH (s)-[r]->(connected:Station)
  WITH s, collect({station: connected.name, line: type(r)}) as connections
  RETURN s.name AS name,
         s.latitude AS latitude,
         s.longitude AS longitude,
         s.zone AS zone,
         ID(s) AS id,
         connections`;

  const result = neo4j.executeQuery(hostName, query, vars);

  if (result.Records.length === 0) {
    return null;
  }

  const record = result.Records[0];
  const name = record.getValue<string>('name');
  const latitude = record.getValue<f32>('latitude');
  const longitude = record.getValue<f32>('longitude');
  const zone = record.getValue<string>('zone');
  const id = record.getValue<string>('id');

  const station = new Station(id, name, latitude, longitude, zone);

  const connections = JSON.parse<Connection[]>(record.get('connections'));
  station.connections = connections;

  return station;
}

/**
 * Find route between two stations
 */
export function findRoute(fromStation: string, toStation: string): Station[] {
  const vars = new neo4j.Variables();
  vars.set('from', fromStation);
  vars.set('to', toStation);

  const query = `
  MATCH (start:Station {name: $from}), (end:Station {name: $to})
  CALL apoc.algo.dijkstra(start, end, '', 'distance', 1.0) 
  YIELD path
  UNWIND nodes(path) as station
  RETURN station.name as name,
         station.latitude as latitude,
         station.longitude as longitude,
         station.zone as zone,
         ID(station) as id`;

  const results = neo4j.executeQuery(hostName, query, vars);
  const route: Station[] = [];

  for (let i = 0; i < results.Records.length; i++) {
    const record = results.Records[i];
    route.push(
      new Station(
        record.getValue<string>('id'),
        record.getValue<string>('name'),
        record.getValue<f32>('latitude'),
        record.getValue<f32>('longitude'),
        record.getValue<string>('zone')
      )
    );
  }

  return route;
}
