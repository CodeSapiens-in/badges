import {
	randomNumberBetween,
	getRandomDateAfter,
	getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";

import { Timestamp } from "firebase/firestore";

export async function generateFakeBadgesAndReviews() {
	const restaurantsToAdd = 5;
	const data = [];

	for (let i = 0; i < restaurantsToAdd; i++) {
		const restaurantTimestamp = Timestamp.fromDate(getRandomDateBefore());

		const badgeData = {
			category:
				randomData.restaurantCategories[
					randomNumberBetween(
						0,
						randomData.restaurantCategories.length - 1
					)
				],
			name: randomData.restaurantNames[
				randomNumberBetween(0, randomData.restaurantNames.length - 1)
			],
			city: randomData.restaurantCities[
				randomNumberBetween(0, randomData.restaurantCities.length - 1)
			],
			photo: `https://storage.googleapis.com/firestorequickstarts.appspot.com/food_${randomNumberBetween(
				1,
				22
			)}.png`,
			timestamp: restaurantTimestamp,
		};

		data.push({
			badgeData
		});
	}
	return data;
}
