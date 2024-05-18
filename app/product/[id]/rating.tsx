"use client";
import { Star } from "lucide-react";
import { useState } from "react";

const StarRating = () => {
  const [rating, setRating] = useState<number>(0);

  const handleClick = (value: number) => {
    setRating(value);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <button key={value} onClick={() => handleClick(value)}>
          <Star fill={value <= rating ? "#FFD700" : "none"} />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
