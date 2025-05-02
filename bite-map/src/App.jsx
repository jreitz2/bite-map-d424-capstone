import "./App.css";
import { useEffect, useState } from "react";
import SignInForm from "./components/SignInForm";
import supabaseClient from "./supabase";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Map from "./components/Map";
import Results from "./components/Results";

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
    <>
      <Header session={session} setSession={setSession}></Header>
      <main>
        {!session && <SignInForm></SignInForm>}
        {session && (
          <>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setMapCenter={setMapCenter}
            />
            <Map mapCenter={mapCenter} setSelectedPlace={setSelectedPlace} />
            <Results />
          </>
        )}
      </main>
    </>
  );
}

export default App;
