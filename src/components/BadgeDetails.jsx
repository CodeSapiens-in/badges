// This component shows badge metadata, and offers some actions to the user like uploading a new badge image, and adding a review.

import React from "react";


const BadgeDetails = ({
	badge,
	userId,
	setIsOpen,
	isOpen,
	children
}) => {
	return (
		<section className="img__section">
			<img src={badge.photo} alt={badge.name} />

			<div className="actions">
				{userId && (
					<img
						className="review"
						onClick={() => {
							setIsOpen(!isOpen);
						}}
						src="/review.svg"
					/>
				)}
			</div>

			<div className="details__container">
				<div className="details">
					<h2>{badge.name}</h2>

					<div className="badge__rating">
						<ul>{renderStars(badge.avgRating)}</ul>

						<span>({badge.numRatings})</span>
					</div>

					<p>
						{badge.category} | {badge.city}
					</p>
					<p>{"$".repeat(badge.price)}</p>
					{children}
				</div>
			</div>
		</section>
	);
};

export default BadgeDetails;
