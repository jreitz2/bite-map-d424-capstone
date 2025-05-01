import "./App.css";
import { useEffect, useState } from "react";
import SignInForm from "./components/SignInForm";
import supabaseClient from "./supabase";

function App() {
  const [session, setSession] = useState(null);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      setSession(null);
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

  return (
    <main>
      {!session && <SignInForm></SignInForm>}
      {session && (
        <div>
          <p>Welcome, {session.user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </main>
  );
}

export default App;
