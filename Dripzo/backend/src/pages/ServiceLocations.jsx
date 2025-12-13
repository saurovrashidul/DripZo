import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { useLoaderData } from "react-router";

// Marker icon fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default Leaflet marker icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to zoom to searched location
// Component to zoom to searched location (UPDATED)
const ZoomToLocation = ({ position }) => {
  const map = useMap();

  if (position) {
    map.flyTo(position, 12, {
      duration: 2, // smooth flyover animation
    });
  }

  return null;
};


const ServiceLocations = () => {
  const serviceData = useLoaderData();
  const [search, setSearch] = useState("");
  const [zoomPosition, setZoomPosition] = useState(null);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.toLowerCase();
    const match = serviceData.find(
      (loc) =>
        loc.city.toLowerCase().includes(query) ||
        loc.district.toLowerCase().includes(query) ||
        loc.covered_area.some((area) => area.toLowerCase().includes(query))
    );

    if (match) setZoomPosition([match.latitude, match.longitude]);
    else alert("No matching location found");
  };

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-5 text-center">
        Service Coverage Map of Bangladesh
      </h2>

      {/* Search Box */}
      <form className="flex justify-center mb-5" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by city, district or area"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-l w-1/3 focus:outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-r">
          Search
        </button>
      </form>

      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        style={{ height: "700px", width: "100%", borderRadius: "12px" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {serviceData.map((location, index) => (
          <React.Fragment key={index}>
            {/* District marker */}
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>
                <div>
                  <h3 className="font-bold text-lg">{location.city}</h3>
                  <p>
                    <strong>Region:</strong> {location.region} <br />
                    <strong>District:</strong> {location.district} <br />
                    <strong>Status:</strong>{" "}
                    <span className="text-green-600">{location.status}</span>
                  </p>

                  <p className="mt-1 font-semibold">Covered Areas:</p>
                  <ul className="list-disc ml-4">
                    {location.covered_area.map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>

                  <a
                    className="text-blue-600 underline mt-2 inline-block"
                    href={location.flowchart}
                    target="_blank"
                  >
                    View Flowchart
                  </a>
                </div>
              </Popup>
            </Marker>

            {/* District coverage circle */}
            <Circle
              center={[location.latitude, location.longitude]}
              radius={12000}
              pathOptions={{
                color: "green",
                fillColor: "lightgreen",
                fillOpacity: 0.3,
              }}
            />

            {/* Simulated covered_area circles */}
            {location.covered_area.map((_, i) => {
              const offsetLat = location.latitude + (Math.random() - 0.5) * 0.05;
              const offsetLng = location.longitude + (Math.random() - 0.5) * 0.05;
              return (
                <Circle
                  key={i}
                  center={[offsetLat, offsetLng]}
                  radius={3000}
                  pathOptions={{ color: "blue", fillColor: "lightblue", fillOpacity: 0.3 }}
                />
              );
            })}
          </React.Fragment>
        ))}

        {/* Zoom to searched location */}
        <ZoomToLocation position={zoomPosition} />
      </MapContainer>
    </div>
  );
};

export default ServiceLocations;
