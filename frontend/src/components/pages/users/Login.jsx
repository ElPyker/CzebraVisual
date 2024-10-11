import React from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import backgroundImage from '../../../../../media/BackGround.jpg';
import { login, apiClient } from '../../../ApiClient';
import { useNavigate } from 'react-router-dom';
import { API_URL_USERS, API_URL_DIVISION_USERS } from '../Config';

const { Title, Paragraph } = Typography;

const Login = ({ setToken, setUserRole, setUserName }) => {
  const navigate = useNavigate();

  const getUserInfo = async (email) => {
    try {
      const response = await apiClient.get(API_URL_USERS);
      return response.data.find(user => user.email === email);
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  const getDivisionForUser = async (userId) => {
    try {
      const response = await apiClient.get(API_URL_DIVISION_USERS);
      const userDivision = response.data.find(du => du.user === userId);
      return userDivision ? userDivision.division : null;
    } catch (error) {
      console.error('Error fetching division for user:', error);
      throw error;
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await login(values.email, values.password);
      
      if (response.access) {
        const userInfo = await getUserInfo(values.email);
        if (userInfo) {
          const userDivision = await getDivisionForUser(userInfo.user_id);

          if (userInfo.role === 'Client') {
            message.error('Rol de usuario no permitido.');
            navigate('/login');
          } else {
            message.success('Inicio de sesión exitoso!');
            
            // Guardar en localStorage y actualizar estado
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('user_role', userInfo.role);
            localStorage.setItem('user_name', `${userInfo.first_name} ${userInfo.last_name}`);
            localStorage.setItem('user_id', userInfo.user_id);
            localStorage.setItem('user_division', userDivision || 'General');
            
            if (setToken && setUserRole && setUserName) {
              setToken(response.access);
              setUserRole(userInfo.role);
              setUserName(`${userInfo.first_name} ${userInfo.last_name}`);
              navigate('/home');
            } else {
              console.error('One or more props are not functions:', { setToken, setUserRole, setUserName });
              message.error('Error al actualizar el estado de la sesión.');
            }
          }
        } else {
          message.error('Información de usuario no disponible.');
        }
      } else {
        message.error('Error en el inicio de sesión. Por favor, revisa tus credenciales.');
      }
    } catch (error) {
      console.error('Error during login process:', error);
      message.error('Error en el inicio de sesión. Por favor, intenta nuevamente más tarde.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Error en el inicio de sesión. Por favor, revisa tus credenciales.');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: `url(${backgroundImage}) no-repeat center center/cover`,
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(3px)',
        }}
      />
      <Card
        title={<Title level={2} style={{ color: '#fff' }}>Welcome</Title>}
        style={{
          width: 400,
          borderRadius: 10,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.0)',
          padding: '30px',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <Paragraph style={{ color: '#fff' }}>
          Please log in with your email and password to continue.
        </Paragraph>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor, introduce tu correo electrónico!' },
              { type: 'email', message: 'El correo electrónico no es válido!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor, introduce tu contraseña!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
