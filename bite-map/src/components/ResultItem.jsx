import { useEffect, useState } from "react";
import supabaseClient from "../supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faRotateLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function ResultItem({ review, fetchReviews }) {
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(review.description);
  const [newRating, setNewRating] = useState(review.rating);

  const date = new Date(review.created_at);
  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
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
      fetchReviews();
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
      fetchReviews();
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
        <p>{review.user_name.split("@")[0]}</p>
        <div className="review-header-right">
          <p>{`${formattedDate} ${formattedTime}`}</p>
          {userId === review.user_id && (
            <>
              <FontAwesomeIcon
                className="icon"
                icon={faTrash}
                onClick={handleDelete}
              />
              {!isEditing ? (
                <FontAwesomeIcon
                  className="icon"
                  icon={faPenToSquare}
                  onClick={() => setIsEditing(true)}
                />
              ) : (
                <FontAwesomeIcon
                  className="icon"
                  icon={faRotateLeft}
                  onClick={() => setIsEditing(false)}
                />
              )}
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
