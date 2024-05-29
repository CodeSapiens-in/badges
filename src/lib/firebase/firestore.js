import { generateFakeBadgesAndReviews } from "@/src/lib/fakeBadges.js";

import {
	collection,
	onSnapshot,
	query,
	getDocs,
	doc,
	getDoc,
	updateDoc,
	orderBy,
	Timestamp,
	runTransaction,
	where,
	addDoc,
	getFirestore,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase/clientApp";

export async function updateBadgeImageReference(
	badgeId,
	publicImageUrl
) {
	const badgeRef = doc(collection(db, "badges"), badgeId);
	if (badgeRef) {
		await updateDoc(badgeRef, { photo: publicImageUrl });
	}
}

const updateWithRating = async (
	transaction,
	docRef,
	newRatingDocument,
	review
) => {
	const badge = await transaction.get(docRef);
	const data = badge.data();
	const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
	const newSumRating = (data?.sumRating || 0) + Number(review.rating);
	const newAverage = newSumRating / newNumRatings;

	transaction.update(docRef, {
		numRatings: newNumRatings,
		sumRating: newSumRating,
		avgRating: newAverage,
	});

	transaction.set(newRatingDocument, {
		...review,
		timestamp: Timestamp.fromDate(new Date()),
	});
};

export async function addReviewToBadge(db, badgeId, review) {
	if (!badgeId) {
		throw new Error("No badge ID has been provided.");
	}

	if (!review) {
		throw new Error("A valid review has not been provided.");
	}

	try {
		const docRef = doc(collection(db, "badges"), badgeId);
		const newRatingDocument = doc(
			collection(db, `badges/${badgeId}/ratings`)
		);

		// corrected line
		await runTransaction(db, transaction =>
			updateWithRating(transaction, docRef, newRatingDocument, review)
		);
	} catch (error) {
		console.error(
			"There was an error adding the rating to the badge",
			error
		);
		throw error;
	}
}

function applyQueryFilters(q, { category, city, price, sort }) {
	if (category) {
		q = query(q, where("category", "==", category));
	}
	if (city) {
		q = query(q, where("city", "==", city));
	}
	if (price) {
		q = query(q, where("price", "==", price.length));
	}
	if (sort === "Rating" || !sort) {
		q = query(q, orderBy("avgRating", "desc"));
	} else if (sort === "Review") {
		q = query(q, orderBy("numRatings", "desc"));
	}
	return q;
}

export async function getBadges(db = db, filters = {}) {
	let q = query(collection(db, "badges"));

	// q = applyQueryFilters(q, filters);
	const results = await getDocs(q);
	return results.docs.map(doc => {
		return {
			id: doc.id,
			...doc.data(),
		};
	});
}

export function getBadgesSnapshot(cb, filters = {}) {
	if (typeof cb !== "function") {
		console.log("Error: The callback parameter is not a function");
		return;
	}

	let q = query(collection(db, "badges"));
	q = applyQueryFilters(q, filters);

	const unsubscribe = onSnapshot(q, querySnapshot => {
		const results = querySnapshot.docs.map(doc => {
			return {
				id: doc.id,
				...doc.data(),
				// Only plain objects can be passed to Client Components from Server Components
				timestamp: doc.data().timestamp.toDate(),
			};
		});

		cb(results);
	});

	return unsubscribe;
}

export async function getBadgeById(db, badgeId) {
	if (!badgeId) {
		console.log("Error: Invalid ID received: ", badgeId);
		return;
	}
	const docRef = doc(db, "badges", badgeId);
	const docSnap = await getDoc(docRef);
	return {
		...docSnap.data(),
		// timestamp: docSnap.data().timestamp.toDate(),
	};
}

export function getBadgeSnapshotById(badgeId, cb) {
	if (!badgeId) {
		console.log("Error: Invalid ID received: ", badgeId);
		return;
	}

	if (typeof cb !== "function") {
		console.log("Error: The callback parameter is not a function");
		return;
	}

	const docRef = doc(db, "badges", badgeId);
	const unsubscribe = onSnapshot(docRef, docSnap => {
		cb({
			...docSnap.data(),
			timestamp: docSnap.data().timestamp.toDate(),
		});
	});
	return unsubscribe;
}

export async function getReviewsByBadgeId(db, badgeId) {
	if (!badgeId) {
		console.log("Error: Invalid badgeId received: ", badgeId);
		return;
	}

	const q = query(
		collection(db, "badges", badgeId, "ratings"),
		orderBy("timestamp", "desc")
	);

	const results = await getDocs(q);
	return results.docs.map(doc => {
		return {
			id: doc.id,
			...doc.data(),
			// Only plain objects can be passed to Client Components from Server Components
			timestamp: doc.data().timestamp.toDate(),
		};
	});
}

export function getReviewsSnapshotByBadgeId(badgeId, cb) {
	if (!badgeId) {
		console.log("Error: Invalid badgeId received: ", badgeId);
		return;
	}

	const q = query(
		collection(db, "badges", badgeId, "ratings"),
		orderBy("timestamp", "desc")
	);
	const unsubscribe = onSnapshot(q, querySnapshot => {
		const results = querySnapshot.docs.map(doc => {
			return {
				id: doc.id,
				...doc.data(),
				// Only plain objects can be passed to Client Components from Server Components
				timestamp: doc.data().timestamp.toDate(),
			};
		});
		cb(results);
	});
	return unsubscribe;
}

export async function addFakeBadgesAndReviews() {
	const data = await generateFakeBadgesAndReviews();
	console.log("Fake badges and reviews added: ", data);
	for (const { badgeData } of data) {
		try {
			console.log('badgeData', badgeData)
			const docRef = await addDoc(
				collection(db, "badges"),
				badgeData
			);

		} catch (e) {
			console.log("There was an error adding the document");
			console.error("Error adding document: ", e);
		}
	}
}
