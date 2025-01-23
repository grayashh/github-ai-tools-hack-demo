import { neo4j } from '@hypermode/modus-sdk-as';
import { Connection, Station } from './classes';
import { JSON } from 'json-as';

const hostName = 'neo4j';

/**
 * Get all stations
 */
export function getAllStations(): Station[] {
  const query = `
  MATCH (s:Station)
  RETURN s.name as name, s.zone as zone
  ORDER BY s.name`;

  const result = neo4j.executeQuery(hostName, query);
  const stations: Station[] = [];

  for (let i = 0; i < result.Records.length; i++) {
    const record = result.Records[i];
    const name = record.getValue<string>('name');
    const zone = record.getValue<string>('zone');
    stations.push(new Station(name, name, 0.0, 0.0, zone));
  }

  return stations;
}

/**
 * Get station by name
 */
export function getStationByName(stationName: string): Station | null {
  const vars = new neo4j.Variables();
  vars.set('name', stationName);

  const query = `
  MATCH (s:Station {name: $name})
  RETURN s.name as name, s.zone as zone`;

  const results = neo4j.executeQuery(hostName, query, vars);

  if (results.Records.length === 0) {
    return null;
  }

  const record = results.Records[0];
  return new Station(record.getValue<string>('name'), record.getValue<string>('name'), 0.0, 0.0, record.getValue<string>('zone'));
}

/**
 * Find connected stations
 */
export function getConnectedStations(stationName: string): Station[] {
  const vars = new neo4j.Variables();
  vars.set('name', stationName);

  const query = `
  MATCH (s:Station {name: $name})-[r]->(connected:Station)
  RETURN connected.name as name, connected.zone as zone`;

  const results = neo4j.executeQuery(hostName, query, vars);
  const stations: Station[] = [];

  for (let i = 0; i < results.Records.length; i++) {
    const record = results.Records[i];
    stations.push(new Station(record.getValue<string>('name'), record.getValue<string>('name'), 0.0, 0.0, record.getValue<string>('zone')));
  }

  return stations;
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
