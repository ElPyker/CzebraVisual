import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Home = () => {
  const userName = localStorage.getItem('user_name');

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <Title level={2}>Bienvenido {userName}!</Title>
      <p>Esta es la página principal de tu aplicación.</p>
    </div>
  );
};

export default Home;
