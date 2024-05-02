import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const Home = () => {
  const navigate = useNavigate();
  const [fieldValue, setFieldValue] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] });

    newSocket.on('fieldValue', (fieldValue) => {
      setFieldValue(fieldValue);
    });

    setSocket(newSocket);

    return () => {
      // Disconnect only if the socket exists
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('getData'); // Request initial data from the server
    }
  }, [socket]);

  useEffect(() => {
    const callHomePage = async () => {
      try {
        const res = await fetch('/Home', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        const data = await res.json();
        console.log(data);
        if (!res.status === 200) throw new Error(res.error);

        console.log('Received value from backend:', data);

      } catch (err) {
        console.log(err);
        navigate('/login');
      }
    };

    callHomePage();
  }, []);

  return (
    <>
        <div className="centerHome" style={{
        backgroundColor: fieldValue && fieldValue <= 7 ? 'rgba(255, 0, 0, 0.6)' : 'rgba(0, 255, 0, 0.3)',
        transition: 'background-color 1s ease-in-out' 
      }}>
        <h6>FieldValue is trash Level value in Trash Bin</h6>
        {fieldValue !== null && (
          <h1>Field Value: {fieldValue}</h1>
        )}
        <small>Threshold is 7</small>
      </div>

    </>
  );
};

export default Home;
