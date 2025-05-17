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
  const [mapCenter, setMapCenter] = useState({
    lat: 36.1716,
    lng: -115.1391,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

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
                  setSelectedPlace={setSelectedPlace}
                />
                <Results
                  selectedPlace={selectedPlace}
                  setSelectedPlace={setSelectedPlace}
                />
              </>
            )}
            <Map mapCenter={mapCenter} setSelectedPlace={setSelectedPlace} />
          </>
        )}
      </main>
    </LoadScript>
  );
}

export default App;
