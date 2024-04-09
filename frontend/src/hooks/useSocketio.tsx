import { Dispatch, SetStateAction, useEffect } from "react";
const PORT = import.meta.env.VITE_API_PORT || 3000; // env port
import io from "socket.io-client"; // socket

interface CreditsData {
  creditsA?: number;
  creditsB?: number;
  creditsC?: number;
}

export function useSocketio(
  setCreditsA: Dispatch<SetStateAction<number | string | null>>,
  setCreditsB: Dispatch<SetStateAction<number | string | null>>,
  setCreditsC: Dispatch<SetStateAction<number | string | null>>
) {
  useEffect(() => {
    // ======== Get data via Socket ========
    const socket = io(`http://localhost:${PORT}`); // socket.io écoute l'url du back
    // Ecoute "creditsUpdated" depuis le back
    socket.on("creditsUpdated", (data: CreditsData) => {
      // console.log(data.message);
      if (data.creditsA) {
        setCreditsA(`${data.creditsA}`);
      }
      if (data.creditsB) {
        setCreditsB(`${data.creditsB}`);
      }
      if (data.creditsC) {
        setCreditsC(`${data.creditsC}`);
      }
    });

    // ======== Demontage composant  ========
    return () => {
      socket.disconnect(); // Déconnexion du serveur de sockets
    };
  }, []);
}
