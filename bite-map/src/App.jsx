import "./App.css";
import { useEffect, useState } from "react";
import SignInForm from "./components/SignInForm";
import supabaseClient from "./supabase";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Map from "./components/Map";
import Results from "./components/Results";
import ReviewForm from "./components/ReviewForm";
import { LoadScript } from "@react-google-maps/api";

function App() {
  const [session, setSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter, setMapCenter] = useState({});
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [reviews, setReviews] = useState([]);

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

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude);
          const lng = Number(position.coords.longitude);
          console.log("Geolocation position:", position);
          if (
            typeof lat === "number" &&
            !isNaN(lat) &&
            typeof lng === "number" &&
            !isNaN(lng)
          ) {
            setMapCenter({ lat, lng });
          }
          setLocationLoaded(true);
        },
        (error) => {
          console.warn(
            "Geolocation not available or denied, using default center."
          );
          setLocationLoaded(true);
        }
      );
    } else {
      setLocationLoaded(true);
    }
  }, [session]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Header
        session={session}
        setSession={setSession}
        setSelectedPlace={setSelectedPlace}
        setMapCenter={setMapCenter}
        setSearchTerm={setSearchTerm}
      ></Header>
      {session && (
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setMapCenter={setMapCenter}
          error={error}
          setError={setError}
          mapCenter={mapCenter}
        />
      )}
      <main>
        {!session && <SignInForm />}
        {session && (
          <>
            {selectedPlace && (
              <>
                <ReviewForm
                  selectedPlace={selectedPlace}
                  fetchReviews={fetchReviews}
                />
                <Results
                  selectedPlace={selectedPlace}
                  setSelectedPlace={setSelectedPlace}
                  reviews={reviews}
                  fetchReviews={fetchReviews}
                />
              </>
            )}
            {locationLoaded ? (
              <Map
                mapCenter={mapCenter}
                setSelectedPlace={setSelectedPlace}
                setError={setError}
              />
            ) : (
              <div className="map-loading-msg">Loading map...</div>
            )}
          </>
        )}
      </main>
    </LoadScript>
  );
}

export default App;
