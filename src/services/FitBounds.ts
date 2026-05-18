import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface Props {
  source: [number, number];
  destination: [number, number];
}
const FitBounds = ({ source, destination }: Props) => {
  const map = useMap();
  useEffect(() => {
    if (!source || !destination) return;
    const bounds = L.latLngBounds([
      L.latLng(source[0], source[1]),
      L.latLng(destination[0], destination[1]),
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, source, destination]);
  return null;
};
export default FitBounds;