import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const useApi = (endpoint: string) => {
  const [data, setData] = useState(null);

  const fetchData = async (endpoint: string) => {
    const { data } = await axios.get(API_URL + endpoint);
    setData(data);
  };

  useEffect(() => {
    fetchData(endpoint);
  }, [endpoint]);
  return data as any;
};

export default useApi;
