import { useEffect, useState } from "react";
import ResultItem from "./ResultItem.jsx";
import supabaseClient from "../supabase.js";

export default function Results({ selectedPlace, setSelectedPlace }) {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState(null);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
        ).toFixed(1)
      : null;

  useEffect(() => {
    if (selectedPlace) {
      const fetchReviews = async () => {
        const { data, error } = await supabaseClient
          .from("reviews")
          .select("*")
          .eq("place_id", selectedPlace.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching reviews:", error);
        } else {
          setReviews(data);
        }
      };

      fetchReviews();
    }
  }, [selectedPlace]);

  const filteredReviews = filterRating
    ? reviews.filter((review) => Number(review.rating) === filterRating)
    : reviews;

  return (
    <div className="results-container">
      <p>Reviews for {selectedPlace.displayName.text}:</p>
      <br />
      {averageRating && <p>Average Rating: {averageRating} / 5</p>}
      <br />
      <div>
        <button onClick={() => setFilterRating(null)}>Show All</button>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button key={rating} onClick={() => setFilterRating(rating)}>
            {rating} Star{rating > 1 && "s"}
          </button>
        ))}
      </div>
      <br />
      <ul>
        {reviews.length > 0 ? (
          filteredReviews.map((review) => (
            <li key={review.id}>
              <ResultItem review={review} setSelectedPlace={setSelectedPlace} />
            </li>
          ))
        ) : (
          <li>No reviews yet.</li>
        )}
      </ul>
    </div>
  );
}
