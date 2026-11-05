export type Review = { id: string; name: string; rating: number; text: string };

export function reviewError(
  name: string,
  rating: number,
  text: string,
): string | null {
  if (!name.trim() || name.trim().length > 80)
    return "Enter your name (up to 80 characters).";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return "Choose a rating from 1 to 5 stars.";
  if (text.trim().length < 10 || text.trim().length > 1500)
    return "Write a review between 10 and 1,500 characters.";
  return null;
}
