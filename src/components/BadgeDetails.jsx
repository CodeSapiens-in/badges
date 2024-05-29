// This component shows badge metadata, and offers some actions to the user like uploading a new badge image, and adding a review.

import React from "react";


const BadgeDetails = ({
	badge
}) => {
	return (
		<section className="relative h-400 w-full">
			<img src={badge.image} alt={badge.name} className="absolute object-cover w-full h-full max-w-none" />

			<div className="details__container">
				<div className="details">
					<h2>{badge.name}</h2>
					<p>
						{badge.category} | {badge.city}
					</p>
				</div>
			</div>
		</section>
	);
};

export default BadgeDetails;
