import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Station } from '@/types/station';

interface StationCardProps {
  station: Station;
}

export function StationCard({ station }: StationCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{station.name}</CardTitle>
        <Badge variant="secondary">Zone {station.zone}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Location: {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
          </div>
          {station.connections && station.connections.length > 0 && (
            <>
              <h3 className="font-semibold">Connected Stations:</h3>
              <div className="flex flex-wrap gap-2">
                {station.connections.map((connection, index) => (
                  <Badge key={index} variant="outline">
                    {connection.station} ({connection.line})
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
