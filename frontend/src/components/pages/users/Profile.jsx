import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../ApiClient';
import { API_URL_USERS } from '../Config';
import {
    ProfileContainer,
    Card,
    LeftSection,
    ProfileImageContainer,
    ProfileImage,
    RightSection,
    Section,
    SectionTitle,
    EditButton
} from '../../../Styled/Profile.styled';
import profileImg from '../../../assets/profile.jpg';
import { EditOutlined, CreditCardOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import { FaPaypal } from 'react-icons/fa';
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import moment from 'moment';

const EditProfileModal = ({ visible, onClose, user, fetchUserData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFinish = async (values) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }
    
            const updatedUserData = {
                first_name: values.first_name || user.first_name,
                last_name: values.last_name || user.last_name,
                email: values.email || user.email,
                phone: values.phone || user.phone,
            };
    
            console.log('Datos que se envían:', updatedUserData); // Para verificar los datos
    
            await apiClient.patch(`${API_URL_USERS}${user.user_id}/`, updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
    
            message.success('Profile updated successfully');
            fetchUserData();
            onClose();
        } catch (error) {
            console.error('Error:', error.response?.data || error.message); // Detalles del error
            message.error(`Error: ${error.response?.data || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    
    
    

    return (
        <Modal
            visible={visible}
            title="Edit Profile"
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => form.submit()}
                >
                    Save
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                }}
                onFinish={handleFinish}
            >
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter your first name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Please enter your email' }]}
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Phone"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const userId = localStorage.getItem('user_id');
            if (!token || !userId) {
                throw new Error('No access token or user ID found');
            }

            const response = await apiClient.get(`${API_URL_USERS}${userId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleEdit = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!user) {
        return <p>No user data available</p>;
    }

    return (
        <ProfileContainer>
            <Card>
                <LeftSection>
                    <ProfileImageContainer>
                        <ProfileImage src={profileImg} alt="Profile" />
                    </ProfileImageContainer>
                    <h1>Profile</h1>
                    <hr />
                    <p><IdcardOutlined /> Name: {user.first_name} {user.last_name}</p>
                    <p><MailOutlined /> Email: {user.email}</p>
                    <p><PhoneOutlined /> Phone: {user.phone}</p>
                    <p><IdcardOutlined /> Role: {user.role}</p>
                    <p>Status: {user.status}</p>
                    <EditButton onClick={handleEdit}>
                        <EditOutlined /> Edit Profile
                    </EditButton>
                </LeftSection>

            </Card>
            <EditProfileModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                user={user}
                fetchUserData={fetchUserData}
            />
        </ProfileContainer>
    );
};

export default Profile;