import { useEffect, useState } from "react";
import ResultItem from "./ResultItem.jsx";
import supabaseClient from "../supabase.js";

export default function Results({ selectedPlace, setSelectedPlace }) {
  const [reviews, setReviews] = useState([]);

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

  return (
    <div className="results-container">
      <p>Reviews for {selectedPlace.displayName.text}:</p>
      <br />
      {averageRating && <p>Average Rating: {averageRating} / 5</p>}
      <br />
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review) => (
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
