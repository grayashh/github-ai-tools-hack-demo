'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StationCard } from '@/components/station-card';
import { Station } from '@/types/station';

// GraphQL query to get station and its connections
const GET_STATION = gql`
  query GetStation($name: String!) {
    getStationByName(stationName: $name) {
      id
      name
      zone
      latitude
      longitude
      connections {
        station
        line
      }
    }
  }
`;

// GraphQL query to get all stations
const GET_ALL_STATIONS = gql`
  query {
    getAllStations {
      id
      name
      zone
      latitude
      longitude
    }
  }
`;

const SEARCH_STATIONS = gql`
  query SearchStations($query: String!) {
    searchStations(searchTerm: $query) {
      id
      name
      zone
      latitude
      longitude
    }
  }
`;

const GET_STATION_DETAILS = gql`
  query GetStationDetails($name: String!) {
    getStationDetails(stationName: $name) {
      id
      name
      zone
      latitude
      longitude
      connections {
        station
        line
      }
    }
  }
`;

export function StationSearch() {
  const [query, setQuery] = useState('');

  const {
    loading: searchLoading,
    error: searchError,
    data: searchData,
  } = useQuery(SEARCH_STATIONS, {
    variables: { query },
    skip: !query,
  });

  const { data: stationDetailsData } = useQuery(GET_STATION_DETAILS, {
    variables: { name: query },
    skip: !query,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter station name..." className="flex-grow" />
        <Button type="submit" disabled={searchLoading}>
          {searchLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {searchError && <div className="text-red-500">Error: {searchError.message}</div>}

      {query && searchData?.searchStations && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchData.searchStations.map((station: Station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </div>
      )}

      {query && stationDetailsData?.getStationDetails && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Station Details</h2>
          <StationCard station={stationDetailsData.getStationDetails} />
        </div>
      )}

      {!query && (
        <div className="text-center mt-8">
          <p className="text-gray-600">Enter a station name to search</p>
        </div>
      )}
    </div>
  );
}
