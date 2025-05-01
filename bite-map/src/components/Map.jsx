import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useCallback, useRef } from "react";

export default function Map() {
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: 36.1699,
    lng: -115.1398,
  };

  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;

    map.addListener("click", (e) => {
      if (e.placeId) {
        e.stop();
        fetchPlaceDetails(e.placeId);
      }
    });
  }, []);

  async function fetchPlaceDetails(placeId) {
    const apiKey = import.meta.env.VITE_MAPS_KEY;
    const fields = "id,displayName";

    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Error fetching place details:", await response.text());
        return;
      }

      const data = await response.json();
      console.log("Place name:", data.displayName?.text || "Unknown");
    } catch (err) {
      console.error("Network error:", err);
    }
  }

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_KEY}>
        {
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
          />
        }
      </LoadScript>
    </div>
  );
}
