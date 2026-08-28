import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

interface EmergencyMapProps {
  latitude: number
  longitude: number
}

function EmergencyMap({
  latitude,
  longitude,
}: EmergencyMapProps) {
  const position: [number, number] = [
    latitude,
    longitude,
  ]

  return (
    <div className="emergency-map">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={position}
          radius={9}
          pathOptions={{
            fillOpacity: 1,
          }}
        >
          <Popup>
            Emergency location
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  )
}

export default EmergencyMap