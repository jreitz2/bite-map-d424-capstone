import { useEffect, useState } from "react";
import supabaseClient from "../supabase";

export default function ResultItem({ review, setSelectedPlace }) {
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(review.description);
  const [newRating, setNewRating] = useState(review.rating);

  const date = new Date(review.created_at);
  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = async () => {
    const { error } = await supabaseClient
      .from("reviews")
      .delete()
      .eq("id", review.id);

    if (error) {
      console.error("Error deleting review:", error);
    } else {
      alert("Review deleted successfully");
      setSelectedPlace(null);
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabaseClient
      .from("reviews")
      .update({ description: newDescription, rating: newRating })
      .eq("id", review.id);

    if (error) {
      console.error("Error updating review:", error);
    } else {
      alert("Review updated successfully");
      setIsEditing(false);
      setSelectedPlace(null);
    }
  };

  useEffect(() => {
    const getUserId = async () => {
      const { data, error } = await supabaseClient.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
      if (error) {
        console.error("Error fetching user ID:", error);
      } else {
        return data.id;
      }
    };
    getUserId();
  }, []);

  return (
    <div className="review-container">
      <div className="review-header">
        <p>{review.user_name}</p>
        <div className="review-header-right">
          <p>{`${formattedDate} - ${formattedTime}`}</p>
          {userId === review.user_id && (
            <>
              <button onClick={handleDelete}>X</button>
              <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="review-body">
        {isEditing ? (
          <div className="review-edit-form">
            <label htmlFor="rating">Rating:</label>

            <input
              type="number"
              min="1"
              max="5"
              id="rating"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
            />

            <textarea
              value={newDescription || ""}
              onChange={(e) => setNewDescription(e.target.value)}
            />

            <button onClick={handleUpdate}>Save</button>
          </div>
        ) : (
          <>
            <p>Rating: {review.rating}</p>
            {review.description && <p>{review.description}</p>}
          </>
        )}
      </div>
    </div>
  );
}
