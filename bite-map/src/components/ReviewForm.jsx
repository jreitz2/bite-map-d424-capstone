import { useState } from "react";

class Review {
  constructor(userID, placeID, placeName, rating) {
    this.userID = userID;
    this.placeID = placeID;
    this.placeName = placeName;
    this.rating = rating;
  }

  toObject() {
    return {
      userID: this.userID,
      placeID: this.placeID,
      placeName: this.placeName,
      rating: this.rating,
    };
  }
}

class DetailedReview extends Review {
  constructor(userID, placeID, placeName, rating, description) {
    super(userID, placeID, placeName, rating);
    this.description = description;
  }

  toObject() {
    return {
      ...super.toObject(),
      description: this.description,
    };
  }
}

export default function ReviewForm({ selectedPlace }) {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
