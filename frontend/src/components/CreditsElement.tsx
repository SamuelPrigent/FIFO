import React from "react";
import { TypeOfCredits, CreditsListProps } from "../types/types.ts";
import { colors } from "../constants/constants.ts";
import styled from "styled-components";
import { colorThemes } from "../constants/constants.ts";

// Style
const CreditsDiv = styled.div<{ $colorClass: string }>`
  border-radius: 8px;
  height: 34px;
  padding: 0px 18px;
  font-size: 17px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  // Test d'utilisation de props récupérant une mixin
  ${(props) => colorThemes[props.$colorClass] || ""}
`;

// Composant
const CreditsElement: React.FC<CreditsListProps> = ({
  type,
  credits,
  index,
}) => {
  const creditValue =
    typeof credits[type as keyof TypeOfCredits] === "number"
      ? credits[type as keyof TypeOfCredits]
      : "?";

  const colorClass = colors[index % colors.length];

  return (
    <CreditsDiv $colorClass={colorClass}>
      {`${type} : ${creditValue}`}
    </CreditsDiv>
  );
};

export default CreditsElement;
