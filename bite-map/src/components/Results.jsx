import { useEffect, useState } from "react";
import ResultItem from "./ResultItem.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function Results({
  selectedPlace,
  setSelectedPlace,
  reviews,
  fetchReviews,
}) {
  const [filterRating, setFilterRating] = useState(null);
  const [filterTerm, setFilterTerm] = useState("");

  const priceIndicators = {
    PRICE_LEVEL_FREE: "$",
    PRICE_LEVEL_INEXPENSIVE: "$",
    PRICE_LEVEL_MODERATE: "$$",
    PRICE_LEVEL_EXPENSIVE: "$$$",
    PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
        ).toFixed(1)
      : null;

  useEffect(() => {
    if (selectedPlace) {
      fetchReviews();
    }
  }, [selectedPlace]);

  const filteredReviews = reviews
    .filter((review) =>
      filterRating ? Number(review.rating) === filterRating : true
    )
    .filter((review) =>
      filterTerm
        ? review.description &&
          review.description.toLowerCase().includes(filterTerm.toLowerCase())
        : true
    );

  return (
    <div className="results-container">
      <p className="text-large-bold">{selectedPlace.displayName.text}</p>
      <p>
        {selectedPlace.formattedAddress &&
          selectedPlace.formattedAddress.split(",")[0]}
      </p>
      <br />
      {averageRating && (
        <p>
          Rating:
          {[...Array(Math.floor(averageRating))].map((_, i) => (
            <FontAwesomeIcon icon={faStar} key={i} className="icon-star" />
          ))}{" "}
          {averageRating} / 5
        </p>
      )}
      <br />
      <p>
        Price:{" "}
        <span className="text-green">
          {selectedPlace.priceLevel
            ? priceIndicators[selectedPlace.priceLevel]
            : "Unavailable"}
        </span>
      </p>
      <br />
      <div>
        <p>Search reviews:</p>
        <input
          type="text"
          placeholder="service"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
      </div>
      <br />
      <div>
        <p>Filter by rating:</p>
        <div className="rating-buttons">
          <button onClick={() => setFilterRating(null)}>All</button>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button key={rating} onClick={() => setFilterRating(rating)}>
              {rating}
            </button>
          ))}
        </div>
      </div>
      <br />
      <ul>
        {reviews.length > 0 ? (
          filteredReviews.map((review) => (
            <li key={review.id}>
              <ResultItem
                review={review}
                setSelectedPlace={setSelectedPlace}
                fetchReviews={fetchReviews}
              />
            </li>
          ))
        ) : (
          <li>No reviews yet.</li>
        )}
      </ul>
    </div>
  );
}
