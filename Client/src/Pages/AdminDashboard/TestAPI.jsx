import { useEffect, useState } from "react";
import axios from "axios";

const TestApi = () => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    axios
      .get("/api/v1/test")
      .then((res) => {
        setResponse(res.data.msg);
        console.log("msg :", res.data);
      })
      .catch((error) => {
        console.error("Error fetching API:", error);
        setResponse("Failed to connect to server.");
      });
  }, []);

  return (
    <div>
      <h1>API Test !!!</h1>
      <p>{response}</p>
    </div>
  );
};

export default TestApi;
