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
            <SearchBar />
            <Map />
            <Results />
          </>
        )}
      </main>
    </>
  );
}

export default App;
