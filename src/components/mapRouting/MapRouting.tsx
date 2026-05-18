import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "./mapRouting.scss"
interface IMapRoutingProps {
  from: [number, number];
  to: [number, number];
  setRouteInfo?: (data: { distance: string; time: string }) => void;
}
const MapRouting = ({ from, to, setRouteInfo }: IMapRoutingProps) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
  const routingControl = (L as any).Routing.control({
  waypoints: [
    L.latLng(from[0], from[1]),
    L.latLng(to[0], to[1]),
  ],
  lineOptions: {
    styles: [{ color: "blue", weight: 5 }],
  },
  addWaypoints: false,
  draggableWaypoints: false,
  routeWhileDragging: false,
  show: false,
}).addTo(map);
routingControl.route();
    routingControl.on("routesfound", function (e: any) {
      const route = e.routes[0];
      const distance = (route.summary.totalDistance / 1000).toFixed(2);
      const time = (route.summary.totalTime / 60).toFixed(2);
      setRouteInfo?.({
        distance: `${distance} km`,
        time: `${time} mins`,
      });
    });
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, from, to, setRouteInfo]);
  return null;
};
export default MapRouting;