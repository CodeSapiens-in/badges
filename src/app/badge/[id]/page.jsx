import Badge from "@/src/components/Badge.jsx";
import { getBadgeById } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser, getAuthenticatedAppForUser as getUser } from "@/src/lib/firebase/serverApp.js";

import { getFirestore } from "firebase/firestore";

export default async function Home({ params }) {
  const { currentUser } = await getUser();
  const {firebaseServerApp} = await getAuthenticatedAppForUser();
  const badge = await getBadgeById(getFirestore(firebaseServerApp), params.id);

  return (
    <main className="main__badge">
      <Badge
        id={params.id}
        initialBadge={badge}
        initialUserId={currentUser?.uid || ""}
      >
       
      </Badge>
      
    </main>
  );
}
