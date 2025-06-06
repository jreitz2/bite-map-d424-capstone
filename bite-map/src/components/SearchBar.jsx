import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  setMapCenter,
  error,
  setError,
  mapCenter,
}) {
  const [placeholder, setPlaceholder] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedSearchTerm}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results?.[0]) {
      console.log("Location found:", data.results[0]);
      setPlaceholder(data.results[0].formatted_address);
      const location = data.results[0].geometry.location;
      setMapCenter(location);
      setSearchTerm("");
    } else {
      console.log("Location not found.", data);
      setError("Location not found. Please try again.");
    }
  };

  useEffect(() => {
    async function fetchAddress() {
      if (mapCenter && mapCenter.lat && mapCenter.lng) {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${mapCenter.lat},${mapCenter.lng}&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results?.[0]) {
          setPlaceholder(
            data.results[0].formatted_address
              .split(",")
              .slice(1, 4)
              .join(",")
              .trim()
          );
        } else {
          setPlaceholder("No address found");
        }
      }
    }
    fetchAddress();
  }, [mapCenter]);

  return (
    <>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder={placeholder}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />

        <button type="submit" className="icon search-icon">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </>
  );
}
