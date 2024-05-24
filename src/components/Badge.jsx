"use client";

// This components shows one individual badge
// It receives data from src/app/badge/[id]/page.jsx

import { React, useState, useEffect } from "react";

import {
  getBadgeSnapshotById,
} from "@/src/lib/firebase/firestore.js";
import {useUser} from '@/src/lib/getUser'
import BadgeDetails from "@/src/components/BadgeDetails.jsx";
import { updateBadgeImage } from "@/src/lib/firebase/storage.js";

export default function Badge({
  id,
  initialBadge,
  initialUserId,
  children
}) {
  const [badgeDetails, setBadgeDetails] = useState(initialBadge);
  const [isOpen, setIsOpen] = useState(false);

  // The only reason this component needs to know the user ID is to associate a review with the user, and to know whether to show the review dialog
  const userId = useUser()?.uid || initialUserId;

  async function handleBadgeImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }

    const imageURL = await updateBadgeImage(id, image);
    setBadgeDetails({ ...badge, photo: imageURL });
  }



  useEffect(() => {
    const unsubscribeFromBadge = getBadgeSnapshotById(id, (data) => {
      setBadgeDetails(data);
    });

    return () => {
      unsubscribeFromBadge();
    };
  }, []);

  return (
    <>
      <BadgeDetails
        badge={badgeDetails}
      >{children}</BadgeDetails>
    </>
  );
}
