import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";
import Composer from "./pages/Composer.tsx";
import Timeline from "./pages/Timeline.tsx";
import { signInWithGoogle, signOutUser, useAuth } from "./firebase/auth.tsx";
import { setUsername, useProfile } from "./firebase/users.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Timeline />,
  },
  {
    path: "/post",
    element: <Composer />,
  },
]);

function ProfileUpdater({ accountId }: { accountId: string }) {
  const profile = useProfile(accountId);
  const [newUsername, setNewUsername] = useState("");

  return (
    <>
      {profile ? (
        <div>
          Your username is <strong>{profile.username}</strong>
        </div>
      ) : (
        <div>You haven't set a username yet.</div>
      )}
      <div>
        <label htmlFor="new-username">Set a new username: </label>
        <input
          id="new-username"
          onChange={(e) => {
            console.log(e.target.value);
            setNewUsername(e.target.value);
          }}
        />{" "}
        <button
          onClick={() => {
            setUsername(accountId, newUsername);
            setNewUsername("");
          }}
        >
          Update
        </button>
      </div>
    </>
  );
}

function AccountBar() {
  const user = useAuth();

  if (user) {
    return (
      <>
        <div>
          Signed in as {user.email}.{" "}
          <button onClick={signOutUser}>Sign out</button>
        </div>
        <ProfileUpdater accountId={user.uid} />
      </>
    );
  } else {
    return (
      <div>
        Not signed in.{" "}
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccountBar />
    <hr />
    <RouterProvider router={router} />
    <hr />
    <div>
      <a href="https://github.com/sodle/fridge-social" target="_blank">
        View Source Code
      </a>
    </div>
  </StrictMode>
);
