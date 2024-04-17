const PORT = import.meta.env.VITE_API_PORT || 3000; // env port
import { useEffect } from "react";
import { CreditData, UpdateCreditsStateFunction } from "../types/types.ts";
import axios from "axios";
const fetcher = (url: string) => axios.get(url).then((res) => res.data);
import useSWR from "swr"; // get

// fetch all => update state
export const getAllDataAndUpdateState = (
  updateCreditsState: UpdateCreditsStateFunction
) => {
  const { data, isLoading, error } = useSWR(
    `http://localhost:${PORT}/api/credits/`,
    fetcher
  );
  useEffect(() => {
    if (!isLoading && !error && data) {
      data.forEach((credit: CreditData) => {
        updateCreditsState(credit.name, credit.number);
      });
    }
  }, [data, isLoading, error]);
};

export default {
  getAllDataAndUpdateState,
};
