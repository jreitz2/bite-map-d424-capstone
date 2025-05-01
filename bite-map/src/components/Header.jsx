import supabaseClient from "../supabase";

export default function Header({ session, setSession }) {
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      setSession(null);
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
