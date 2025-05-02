import { useState } from "react";

export default function SearchBar({ searchTerm, setSearchTerm, setMapCenter }) {
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    const apiKey = import.meta.env.VITE_MAPS_KEY;
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedSearchTerm}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results?.[0]) {
      const location = data.results[0].geometry.location;
      setMapCenter(location);
      setSearchTerm("");
    } else {
      console.log("Location not found.");
      setError("Location not found. Please try again.");
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Las Vegas, NV"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button type="submit">Search</button>
      </form>
      {error && <div className="error">{error}</div>}
    </>
  );
}
