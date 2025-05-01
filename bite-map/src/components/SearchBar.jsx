import { useState } from "react";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {};

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Las Vegas, NV"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
