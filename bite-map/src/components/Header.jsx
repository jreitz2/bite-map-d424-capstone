import supabaseClient from "../supabase";
import logo2 from "../assets/logo2-nobg.png";

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
    }
  };

  return (
    <header>
      <img src={logo2} alt="Logo" className="logo" />
      {session && (
        <div className="user-info-logout">
          <p>{session.user.email.split("@")[0]}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}
