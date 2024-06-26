import { useEffect } from "react";
const PORT = import.meta.env.VITE_API_PORT || 3000; // env port
import io from "socket.io-client"; // socket
import { CreditsData, TypeOfCredits } from "../types/types";

export function useSocketio(
  updateCreditsState: (type: string, value: number) => void,
  allType: Array<keyof TypeOfCredits & string> // ou Array<string>
) {
  useEffect(() => {
    // ======== Get data via Socket ========
    const socket = io(`http://localhost:${PORT}`); // socket.io écoute l'url du back
    // Ecoute "creditsUpdated" depuis le back
    socket.on("creditsUpdated", (data: CreditsData) => {
      // console.log(data.message);
      // Update le state après vérification que la data reçu possède bien une data avec la Key demandé
      allType.forEach((type) => {
        const key = `credits${type}`;
        const value = data[key];
        if (value !== undefined) {
          updateCreditsState(type, value);
        }
      });
    });

    // ======== Demontage composant  ========
    return () => {
      socket.disconnect(); // Déconnexion du serveur de sockets
    };
  }, []);
}
