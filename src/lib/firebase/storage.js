import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "@/src/lib/firebase/clientApp";

import { updateBadgeImageReference } from "@/src/lib/firebase/firestore";

export async function updateBadgeImage(badgeId, image) {
	try {
		if (!badgeId)
			throw new Error("No badge ID has been provided.");

		if (!image || !image.name)
			throw new Error("A valid image has not been provided.");

		const publicImageUrl = await uploadImage(badgeId, image);
		await updateBadgeImageReference(badgeId, publicImageUrl);

		return publicImageUrl;
	} catch (error) {
		console.error("Error processing request:", error);
	}
}

async function uploadImage(badgeId, image) {
	const filePath = `images/${badgeId}/${image.name}`;
	const newImageRef = ref(storage, filePath);
	await uploadBytesResumable(newImageRef, image);

	return await getDownloadURL(newImageRef);
}
