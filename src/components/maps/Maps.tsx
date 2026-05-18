import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import MapRouting from "../mapRouting/MapRouting";
import FitBounds from "../../services/FitBounds";
import L from "leaflet";
import "./Maps.scss";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
function Maps() {
  const location = useLocation();
  const sourceName = location.state?.source;
  const destinationName = location.state?.destination;
  const [sourceCoords, setSourceCoords] = useState<[number, number] | null>(
    null,
  );
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const fetchCoordinates = async () => {
      try {
        if (sourceName) {
          const res = await provider.search({ query: sourceName });

          if (res.length > 0) {
            setSourceCoords([res[0].y, res[0].x]);
          }
        }
        if (destinationName) {
          const res = await provider.search({ query: destinationName });
          if (res.length > 0) {
            setDestCoords([res[0].y, res[0].x]);
          }
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    };
    fetchCoordinates();
  }, [sourceName, destinationName]);
  const midPoint: [number, number] | null =
    sourceCoords && destCoords
      ? [
          (sourceCoords[0] + destCoords[0]) / 2,
          (sourceCoords[1] + destCoords[1]) / 2,
        ]
      : null;
  const invisibleIcon = L.divIcon({
    className: "invisible-marker",
    html: "",
    iconSize: [0, 0],
  });
  if (!sourceCoords || !destCoords) {
    return <h3 style={{ textAlign: "center" }}>Loading map...</h3>;
  }
  return (
    <div>
      {/* <div className="ride-details"
      >
        <h3 className="mb-2">Ride Details</h3>
        <div className="d-flex gap-4"
        >
          <p>
            <strong>From:</strong> {sourceName}
          </p>
          <p>
            <strong>To:</strong> {destinationName}
          </p>
          {routeInfo ? (
            <>
              <p>
                <strong>Distance:</strong> {routeInfo.distance}
              </p>

              <p>
                <strong>Time:</strong> {routeInfo.time}
              </p>
            </>
          ) : (
            <p>Calculating route...</p>
          )}
        </div>
      </div> */}
      <div className="map-container">
        <MapContainer
          center={[17.385, 78.4867]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={sourceCoords} zIndexOffset={1000}>
            <Popup>{sourceName}</Popup>
          </Marker>
          <Marker position={destCoords} zIndexOffset={1000}>
            <Popup>{destinationName}</Popup>
          </Marker>
          {midPoint && (
            <Marker position={midPoint} icon={invisibleIcon}>
              <Tooltip permanent direction="top" offset={[0, -10]}>
                <div className="route-tooltip">
                  <h5>Ride Info</h5>
                  <p>From: {sourceName}</p>
                  <p>To: {destinationName}</p>
                  {routeInfo && (
                    <>
                      <p>Distance: {routeInfo.distance}</p>
                      <p>Time: {routeInfo.time}</p>
                    </>
                  )}
                </div>
              </Tooltip>
            </Marker>
          )}
          <FitBounds source={sourceCoords} destination={destCoords} />
          <MapRouting
            from={sourceCoords}
            to={destCoords}
            setRouteInfo={setRouteInfo}
          />
        </MapContainer>
      </div>
    </div>
  );
}
export default Maps;
