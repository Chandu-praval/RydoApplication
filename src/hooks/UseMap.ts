// import { useEffect } from "react";
// import { useMap } from "react-leaflet";
// import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
// import "leaflet-geosearch/dist/geosearch.css";

// const SearchField = () => {
//   const map = useMap();
//   useEffect(() => {
//     const provider = new OpenStreetMapProvider();
//     const searchControl = new (GeoSearchControl as any)({
//       provider: provider,
//       style: 'bar', 
//       autoClose: true,
//       retainZoomLevel: false,
//       animateZoom: true,
//       keepResult: true,
//       updateMap: true
//     });
//     map.addControl(searchControl);
//     return () => {
//       map.removeControl(searchControl);
//     };
//   }, [map]);

//   return null;
// };
// export default SearchField;