"use client";

import { useRef, useState } from "react";
import { reviewError, type Review } from "@/lib/reviews";
import { Icon } from "./icon";

const sampleReviews = [
  {
    name: "Ayesha Khan",
    city: "Karachi",
    rating: 5,
    text: "Chai aur quick breakfast ke liye bohat convenient. Kitchen mein zyada jagah bhi nahi leta.",
  },
  {
    name: "Muhammad Ali",
    city: "Lahore",
    rating: 4,
    text: "A simple addition to my small kitchen. I like having one cooking spot for everyday meals.",
  },
  {
    name: "Fatima Ahmed",
    city: "Islamabad",
    rating: 5,
    text: "Shaam ki chai aur halka phulka khana banane ke liye acha option. Simple design pasand aaya.",
  },
];

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);
  const previous = useRef("");
  const average = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : null;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const text = String(data.get("review") || "").trim();
    const invalid = reviewError(name, rating, text);
    if (invalid) {
      setError(invalid);
      setPosted(false);
      return;
    }
    const signature = JSON.stringify([name, rating, text]);
    if (signature === previous.current) {
      setError("This review has already been posted.");
      return;
    }
    previous.current = signature;
    setReviews((items) => [
      { id: crypto.randomUUID(), name, rating, text },
      ...items,
    ]);
    form.reset();
    setRating(0);
    setError(null);
    setPosted(true);
  }

  return (
    <section
      className="reviews-section section"
      id="reviews"
      aria-labelledby="reviews-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR EVERYDAY EXPERIENCE</p>
          <h2 id="reviews-heading">Good things are worth sharing.</h2>
        </div>
        <span className="review-count">
          {reviews.length
            ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} · ${average} average`
            : "No reviews yet"}
        </span>
      </div>
      <div className="reviews-grid">
        <div className="review-list">
          {!reviews.length ? (
            <div className="empty-reviews">
              <div className="review-stars muted">
                {Array.from({ length: 5 }, (_, index) => (
                  <Icon key={index} name="star" />
                ))}
              </div>
              <h3>Be the first to review.</h3>
              <p>
                Have a moment with your cooker?
                <br />
                We’d love to hear about it.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <article className="review" key={review.id}>
                <div className="review-heading">
                  <span className="avatar">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <strong>{review.name}</strong>
                    <span
                      className="review-stars"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <Icon
                          key={index}
                          name="star"
                          fill={index < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </span>
                  </div>
                  <span className="review-local">Just posted</span>
                </div>
                <p>{review.text}</p>
              </article>
            ))
          )}
          <div
            className="sample-reviews"
            aria-labelledby="sample-reviews-heading"
          >
            <h3 id="sample-reviews-heading">Sample reviews</h3>
            <p className="small muted">
              Fictional examples with Pakistani names and cities. These are not
              real customer reviews and do not count toward the rating.
            </p>
            {sampleReviews.map((review) => (
              <article className="review" key={review.name}>
                <div className="review-heading">
                  <span className="avatar">{review.name.charAt(0)}</span>
                  <div>
                    <strong>{review.name}</strong>
                    <p className="small muted">{review.city}, Pakistan</p>
                    <span
                      className="review-stars"
                      aria-label={`Sample rating: ${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <Icon
                          key={index}
                          name="star"
                          fill={index < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </span>
                  </div>
                  <span className="review-local">Fictional sample</span>
                </div>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </div>
        <form className="review-form" onSubmit={submit}>
          <h3>Write your review</h3>
          <p className="small muted">
            Your review appears for this visit only and clears when you refresh.
          </p>
          <fieldset className="rating-field">
            <legend>Your rating</legend>
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  className={value <= rating ? "selected" : ""}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => {
                      setRating(value);
                      setPosted(false);
                    }}
                    aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                  />
                  <Icon
                    name="star"
                    fill={value <= rating ? "currentColor" : "none"}
                    width="26"
                    height="26"
                  />
                </label>
              ))}
            </div>
          </fieldset>
          <label htmlFor="review-name">Your name</label>
          <input
            id="review-name"
            name="name"
            autoComplete="name"
            placeholder="How should we call you?"
            required
            maxLength={80}
            onChange={() => setPosted(false)}
          />
          <label htmlFor="review-text">Your review</label>
          <textarea
            id="review-text"
            name="review"
            rows={4}
            placeholder="Tell us about your experience…"
            required
            minLength={10}
            maxLength={1500}
            onChange={() => setPosted(false)}
          />
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          {posted && (
            <p className="success-message" role="status">
              <Icon name="check" />
              Your review has been posted for this visit.
            </p>
          )}
          <button className="button button-primary" type="submit">
            Post review
            <Icon name="arrow" />
          </button>
        </form>
      </div>
    </section>
  );
}
