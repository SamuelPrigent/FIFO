import React from "react";
import { TypeOfCredits, CreditsListProps } from "../types/types.ts"; // Assurez-vous que le chemin est correct

const CreditsList: React.FC<CreditsListProps> = ({ type, credits }) => {
  const creditValue =
    typeof credits[type as keyof TypeOfCredits] === "number"
      ? credits[type as keyof TypeOfCredits]
      : "?";
  return (
    <div className="queueListComponent">
      <div className="creditsContainer">
        <span className={`creditsButton credits${type}`}>
          {`${type} : ${creditValue}`}
        </span>
      </div>
    </div>
  );
};

export default CreditsList;
