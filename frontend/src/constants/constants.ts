import { TypeOfCredits } from "../types/types";
import { ColorThemes } from "../types/types";

export const allType: Array<keyof TypeOfCredits & string> = [
  "A",
  "B",
  "C",
  "D",
  "E",
];

export const colors: string[] = [
  "greenTheme",
  "blueTheme",
  "redTheme",
  "purpleTheme",
  "magicTheme",
  "orangeTheme",
  "pinkredTheme",
  "venusTheme",
  "pandaTheme",
  "marsTheme",
];

export const actionTypes: string[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// mixin for styled components
export const colorThemes: ColorThemes = {
  redTheme: `
    user-select: none;
    background-color: #ffd0e6;
    color: darkred;
    border-color: darkred;
  `,
  greenTheme: `
    user-select: none;
    background-color: #a0f8a0;
    color: #004e00;
    border-color: darkgreen;
  `,
  // Ajoutez tous les autres thèmes ici
  blueTheme: `
  user-select: none;
  background-color: #b2ecff;
  color: darkblue;
  border-color: darkblue;
  `,
  purpleTheme: `
  user-select: none;
  background-color: #efdffc;
  color: darkslateblue;
  border-color: darkslateblue;
`,
  orangeTheme: `
user-select: none;
background-color: #ffeedd;
color: #924400;
border-color: #924400;
`,
  seablueTheme: `
  user-select: none;
  background-color: #c4fff2;
  color: #3b3373;
  border-color: #3b3373;
`,
  pinkredTheme: `
user-select: none;
background-color: #ffc8f5;
color: #7400a6;
border-color: #7400a6;
`,
  magicTheme: `
  user-select: none;
  background-color: #c8ffe1;
  color: #004020;
  border-color: #004020;
`,
  pandaTheme: `
  user-select: none;
  background-color: #c7e3ff;
  color: #480045;
  border-color: #480045;
`,
  marsTheme: `
  user-select: none;
  background-color: #e8edff;
  color: #0c0041;
  border-color: #0c0041;
`,
  venusTheme: `
user-select: none;
background-color: #c2f0ba;
color: #002b56;
border-color: #002b56;
`,
};
