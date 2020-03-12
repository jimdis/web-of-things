import React, { useState } from "react";
import useApi from "./useApi";
import "./App.css";

const App = () => {
  const [endpoint, setEndpoint] = useState("/");
  const data = useApi(endpoint);
  console.log(data);
  const handleEndpointChange = () => {
    if (endpoint === "/") {
      setEndpoint("/model");
    } else setEndpoint("/");
  };
  return (
    <div>
      <h1>Data</h1>
      <h2>Fields returned</h2>
      <button onClick={handleEndpointChange}>Change endpoint</button>
      <ul>{data && Object.keys(data).map(key => <li key={key}>{key}</li>)}</ul>
    </div>
  );
};

export default App;
