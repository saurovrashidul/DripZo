import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useLoaderData } from "react-router";

// Leaflet marker fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ===========================
   Zoom Controller (NO SHIVER)
=========================== */
const ZoomToLocation = ({ position, onZoomEnd }) => {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(position, 12, { duration: 2 });

    const handleMoveEnd = () => {
      onZoomEnd();
      map.off("moveend", handleMoveEnd);
    };

    map.on("moveend", handleMoveEnd);
  }, [position]);

  return null;
};

/* ===========================
   Main Component
=========================== */
const ServiceLocations = () => {
  const serviceData = useLoaderData();

  const [search, setSearch] = useState("");
  const [zoomPosition, setZoomPosition] = useState(null);
  const [matchedDistrict, setMatchedDistrict] = useState(null);
  const [showCoverage, setShowCoverage] = useState(false);

  /* ===========================
     Search Handler
  =========================== */
  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.toLowerCase().trim();

    if (!query) return;

    const match = serviceData.find(
      (loc) =>
        loc.city.toLowerCase().includes(query) ||
        loc.district.toLowerCase().includes(query) ||
        loc.covered_area.some((area) =>
          area.toLowerCase().includes(query)
        )
    );

    if (match) {
      setShowCoverage(false);       // IMPORTANT
      setMatchedDistrict(match);
      setZoomPosition([match.latitude, match.longitude]);
    } else {
      alert("No matching district found");
    }
  };

  return (
    <div className="px-3 py-4 md:px-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
        Service Coverage Map of Bangladesh
      </h2>


      {/* ===========================
          Responsive Search Box
      =========================== */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row justify-center gap-2 mb-5"
      >
        <input
          type="text"
          placeholder="Search district or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-80 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* ===========================
          Coverage Headline (AFTER ZOOM)
      =========================== */}
      {showCoverage && matchedDistrict && (
        <div className="mb-4 text-center">
          <h3 className="text-xl font-semibold">
            Coverage Areas in {matchedDistrict.district}
          </h3>
          <p className="text-gray-700 mt-1">
            {matchedDistrict.covered_area.join(", ")}
          </p>
        </div>
      )}

      {/* ===========================
          Map
      =========================== */}
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        style={{
          height: "70vh",
          width: "100%",
          borderRadius: "12px",
        }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {serviceData.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <div>
                <h3 className="font-bold text-lg">{location.city}</h3>
                <p>
                  <strong>District:</strong> {location.district}
                </p>
                <p className="mt-2 font-semibold">Covered Areas:</p>
                <ul className="list-disc ml-4">
                  {location.covered_area.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
                {/* <a
                  href={location.flowchart}
                  target="_blank"
                  className="text-blue-600 underline mt-2 inline-block"
                >
                  View Flowchart
                </a> */}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Smooth zoom without shivering */}
        <ZoomToLocation
          position={zoomPosition}
          onZoomEnd={() => setShowCoverage(true)}
        />
      </MapContainer>
    </div>
  );
};

export default ServiceLocations;
