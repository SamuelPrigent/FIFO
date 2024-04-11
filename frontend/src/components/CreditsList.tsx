import React from "react";
import { TypeOfCredits, CreditsListProps } from "../types/types.ts";
import { colors } from "../constants/constants.ts";

const CreditsList: React.FC<CreditsListProps> = ({ type, credits, index }) => {
  const creditValue =
    typeof credits[type as keyof TypeOfCredits] === "number"
      ? credits[type as keyof TypeOfCredits]
      : "?";

  const colorClass = colors[index % colors.length];

  return (
    <span className={`creditsButton ${colorClass}`}>
      {`${type} : ${creditValue}`}
    </span>
  );
};

export default CreditsList;
