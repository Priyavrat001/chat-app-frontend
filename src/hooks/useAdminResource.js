import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useAdminResource = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    axios.get(url, {
      withCredentials: true,
      signal: controller.signal,
    }).then(({ data: response }) => {
      setData(response);
    }).catch((requestError) => {
      if (requestError.code !== "ERR_CANCELED") {
        setError(requestError.response?.data?.message || requestError.message);
      }
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });

    return () => controller.abort();
  }, [url, refreshKey]);

  return { data, loading, error, refresh };
};
