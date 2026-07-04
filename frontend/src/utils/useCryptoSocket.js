"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const socket = io(BACKEND_URL);

const useCryptoSocket = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    socket.on("crypto_data", (data) => {
      setData(data);
    });
    socket.on('crypto_data', (data) => {
        console.log('🔁 Received crypto data from socket:', data);
      });
      
    return () => {
      socket.off("crypto_data");
    };
  }, []);

  return data;
};

export default useCryptoSocket;
