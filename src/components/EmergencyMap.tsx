import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'

import { useEffect } from 'react'

import 'leaflet/dist/leaflet.css'

interface EmergencyMapProps {
  latitude: number
  longitude: number

  responderLatitude?: number | null
  responderLongitude?: number | null
}

interface MapBoundsControllerProps {
  emergencyLatitude: number
  emergencyLongitude: number

  responderLatitude?: number | null
  responderLongitude?: number | null
}

function MapBoundsController({
  emergencyLatitude,
  emergencyLongitude,
  responderLatitude,
  responderLongitude,
}: MapBoundsControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (
      responderLatitude == null ||
      responderLongitude == null
    ) {
      map.setView(
        [
          emergencyLatitude,
          emergencyLongitude,
        ],
        16,
      )

      return
    }

    map.fitBounds(
      [
        [
          emergencyLatitude,
          emergencyLongitude,
        ],

        [
          responderLatitude,
          responderLongitude,
        ],
      ],
      {
        padding: [45, 45],
        maxZoom: 16,
      },
    )
  }, [
    map,
    emergencyLatitude,
    emergencyLongitude,
    responderLatitude,
    responderLongitude,
  ])

  return null
}

function EmergencyMap({
  latitude,
  longitude,
  responderLatitude,
  responderLongitude,
}: EmergencyMapProps) {
  const emergencyPosition:
    [number, number] = [
      latitude,
      longitude,
    ]

  const hasResponderLocation =
    responderLatitude != null &&
    responderLongitude != null

  return (
    <div className="emergency-map">
      <MapContainer
        center={emergencyPosition}
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

        <MapBoundsController
          emergencyLatitude={latitude}
          emergencyLongitude={longitude}
          responderLatitude={
            responderLatitude
          }
          responderLongitude={
            responderLongitude
          }
        />

        <CircleMarker
          center={emergencyPosition}
          radius={10}
          pathOptions={{
            color: '#DC2626',
            fillColor: '#DC2626',
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>
            <strong>
              Emergency location
            </strong>
          </Popup>
        </CircleMarker>

        {hasResponderLocation && (
          <CircleMarker
            center={[
              responderLatitude,
              responderLongitude,
            ]}
            radius={10}
            pathOptions={{
              color: '#111827',
              fillColor: '#111827',
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Popup>
              <strong>
                Responder location
              </strong>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  )
}

export default EmergencyMap