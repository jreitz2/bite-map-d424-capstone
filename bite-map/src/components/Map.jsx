import { GoogleMap } from "@react-google-maps/api";
import { useCallback } from "react";

export default function Map({ mapCenter, setSelectedPlace, setError }) {
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const onLoad = useCallback((map) => {
    map.addListener("click", async (e) => {
      if (e.placeId) {
        e.stop();
        const placeDetails = await fetchPlaceDetails(e.placeId);
        if (
          placeDetails &&
          placeDetails.types &&
          placeDetails.types.includes("restaurant")
        ) {
          setError(null);
          setSelectedPlace(placeDetails);
        } else {
          setError("Only restaurants can be selected.");
        }
      }
    });
  }, []);

  async function fetchPlaceDetails(placeId) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const fields = "id,displayName,types,formattedAddress,priceLevel";

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
      console.log("Place data: ", data || "Unknown");
      return data;
    } catch (err) {
      console.error("Network error:", err);
    }
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={11}
        onLoad={onLoad}
      />
    </div>
  );
}
