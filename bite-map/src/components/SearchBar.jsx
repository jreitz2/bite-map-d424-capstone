export default function SearchBar({ searchTerm, setSearchTerm, setMapCenter }) {
  const handleSearch = async (e) => {
    const apiKey = import.meta.env.VITE_MAPS_KEY;
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedSearchTerm}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results?.[0]) {
      const location = data.results[0].geometry.location;
      setMapCenter(location);
    } else {
      console.log("Location not found.");
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder="Las Vegas, NV"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <button type="submit">Search</button>
    </form>
  );
}
