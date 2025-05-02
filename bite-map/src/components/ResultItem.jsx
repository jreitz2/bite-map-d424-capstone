import { useEffect, useState } from "react";
import supabaseClient from "../supabase";

export default function ResultItem({ review, setSelectedPlace }) {
  const [userId, setUserId] = useState(null);
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
            <button onClick={handleDelete}>X</button>
          )}
        </div>
      </div>
      <div className="review-body">
        <p>Rating: {review.rating}</p>
        {review.description != null && <p>{review.description}</p>}
      </div>
    </div>
  );
}
