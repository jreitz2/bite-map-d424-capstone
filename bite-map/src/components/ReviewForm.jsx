import { useState } from "react";
import supabaseClient from "../supabase";

class Review {
  constructor(user_id, user_name, place_id, place_name, rating) {
    this.user_id = user_id;
    this.user_name = user_name;
    this.place_id = place_id;
    this.place_name = place_name;
    this.rating = rating;
  }

  toObject() {
    return {
      user_id: this.user_id,
      user_name: this.user_name,
      place_id: this.place_id,
      place_name: this.place_name,
      rating: this.rating,
    };
  }
}

class DetailedReview extends Review {
  constructor(user_id, user_name, place_id, place_name, rating, description) {
    super(user_id, user_name, place_id, place_name, rating);
    this.description = description;
  }

  toObject() {
    return {
      ...super.toObject(),
      description: this.description,
    };
  }
}

export default function ReviewForm({ selectedPlace, setSelectedPlace }) {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await supabaseClient.auth.getUser();
    const userID = user.data.user.id;
    const userName = user.data.user.user_metadata.email || "Anonymous";

    const ReviewClass = description.trim() ? DetailedReview : Review;

    const review = new ReviewClass(
      userID,
      userName,
      selectedPlace.id,
      selectedPlace.displayName.text,
      parseInt(rating),
      description.trim()
    );

    const { data, error } = await supabaseClient
      .from("reviews")
      .insert([review.toObject()])
      .select("*");

    console.log("Inserted review:", data || "Unknown");
    if (error) {
      console.error("Error inserting review:", error.message);
    } else {
      alert("Review submitted successfully!");
      setRating(0);
      setDescription("");
      setSelectedPlace(null);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <p>Leave a review for {selectedPlace.displayName.text}:</p>
      <fieldset>
        <legend>Rating:</legend>
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="rating"
              value={value}
              checked={rating === String(value)}
              onChange={(e) => setRating(e.target.value)}
              required
            />
            {value}
          </label>
        ))}
      </fieldset>

      <label htmlFor="description">Review (optional):</label>
      <textarea
        id="description"
        value={description}
        rows={10}
        cols={80}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
