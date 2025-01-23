import { StationSearch } from '@/components/station-search';
import { ApolloWrapper } from '@/components/apollo-wrapper';

export default function StationsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">London Underground Stations</h1>
      <ApolloWrapper>
        <StationSearch />
      </ApolloWrapper>
    </div>
  );
}
