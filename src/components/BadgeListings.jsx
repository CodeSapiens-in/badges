"use client";

// This components handles the badge listings page
// It receives data from src/app/page.jsx, such as the initial badges and search params from the URL

import Link from "next/link";
import { React, useState } from "react";

const BadgeItem = ({ badge }) => (
	<li key={badge.id}>
		<Link href={`/badge/${badge.id}`}>
			<ActiveBadge badge={badge} />
		</Link>
	</li>
);

const ActiveBadge = ({ badge }) => (
	<div>
		<ImageCover photo={badge.image} name={badge.name} />
		<BadgeDetails badge={badge} />
	</div>
);

const ImageCover = ({ photo, name }) => (
	<div className="image-cover">
		<img src={photo} alt={name} />
	</div>
);

const BadgeDetails = ({ badge }) => (
	<div className="badge__details">
		<h2>{badge.name}</h2>
		{/* <BadgeMetadata badge={badge} /> */}
	</div>
);


const BadgeMetadata = ({ badge }) => (
	<div className="badge__meta">
		<p>
			{badge.category} | {badge.city}
		</p>
		<p>{"$".repeat(badge.price)}</p>
	</div>
);

export default function BadgeListings({
	initialBadges
}) {
	const [badges, setBadges] = useState(initialBadges);
	return (
		<article>
			<ul className="badges">
				{badges.map(badge => (
					<BadgeItem
						key={badge.id}
						badge={badge}
					/>
				))}
			</ul>
		</article>
	);
}
