import supabaseClient from "../supabase";

export default function Header({
  session,
  setSession,
  setSelectedPlace,
  setMapCenter,
  setSearchTerm,
}) {
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      setSession(null);
      setSelectedPlace(null);
      setSearchTerm("");
      setMapCenter({ lat: 36.1716, lng: -115.1391 });
    }
  };

  return (
    <header>
      <h1>BiteMap</h1>
      {session && (
        <div className="user-info-logout">
          <p>Welcome, {session.user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}
