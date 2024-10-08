import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, Select, DatePicker, message, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { API_URL_REQUESTS } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';


const { Option } = Select;

const buttonColor = '#97b25e';

const RequestPage = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentRequest, setCurrentRequest] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, requests]);

    useEffect(() => {
        if (isDeleteModalVisible) {
            setCountdown(3);
            setDeleteEnabled(false);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setDeleteEnabled(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }, [isDeleteModalVisible]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_REQUESTS);
            setRequests(response.data);
            setFilteredRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
        setLoading(false);
    };

    const showModal = (request = null) => {
        setCurrentRequest(request);
        setEditMode(!!request);
        if (request) {
            form.setFieldsValue(request);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                code: values.code,
                user: values.user,
                company: values.company,
                title: values.title,
                name: values.name,
                request_type: values.request_type,
                status: values.status,
                details: values.details,
                desired_delivery_date: values.desired_delivery_date,
                is_urgent: values.is_urgent,
            };

            if (editMode) {
                await apiClient.put(`${API_URL_REQUESTS}${currentRequest.request_id}/`, data);
                message.success('Request updated successfully');
            } else {
                await apiClient.post(API_URL_REQUESTS, data);
                message.success('Request added successfully');
            }
            fetchRequests();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving request:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }
            message.error('Error saving request');
        }
    };

    const showDeleteModal = (requestId) => {
        setCurrentRequestId(requestId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_REQUESTS}${currentRequestId}/`);
            fetchRequests();
            message.success('Request deleted successfully');
        } catch (error) {
            console.error('Error deleting request:', error);
            message.error('Error deleting request');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = requests.filter(request =>
            (request.title && request.title.toLowerCase().includes(searchText.toLowerCase())) ||
            (request.code && request.code.toLowerCase().includes(searchText.toLowerCase())) ||
            (request.name && request.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (request.request_type && request.request_type.toLowerCase().includes(searchText.toLowerCase())) ||
            (request.status && request.status.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredRequests(filtered);
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Request Type', dataIndex: 'request_type', key: 'request_type' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Desired Delivery Date', dataIndex: 'desired_delivery_date', key: 'desired_delivery_date' },
        { title: 'Is Urgent?', dataIndex: 'is_urgent', key: 'is_urgent', render: is_urgent => is_urgent ? 'Yes' : 'No' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Button
                            onClick={() => showModal(record)}
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: buttonColor }}
                        />
                    </Tooltip>
                    <Tooltip title="Remove">
                        <Button
                            onClick={() => showDeleteModal(record.request_id)}
                            type="link"
                            icon={<DeleteOutlined />}
                            danger
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Requests" />
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Input
                    placeholder="Search Request..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={() => showModal()} style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                    Add Request
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredRequests}
                rowKey="request_id"
                loading={loading}
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    }
                }}
            />
            <Modal
                title={editMode ? 'Edit Request' : 'Add Request'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okButtonProps={{ style: { backgroundColor: buttonColor, borderColor: buttonColor } }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="request_type" label="Request Type" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Graphic Design">Graphic Design</Option>
                            <Option value="Branding">Branding</Option>
                            <Option value="Promotional Video">Promotional Video</Option>
                            <Option value="Digital Campaigns">Digital Campaigns</Option>
                            <Option value="Web Design and Development">Web Design and Development</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="desired_delivery_date" label="Desired Delivery Date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="is_urgent" label="Is Urgent?" valuePropName="checked">
                        <Select>
                            <Option value={true}>Yes</Option>
                            <Option value={false}>No</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="details" label="Details">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirm Deletion"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Delete${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white', color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>Are you sure you want to delete this request? Please wait {countdown} seconds to confirm deletion.</p>
            </Modal>
        </div>
    );
};

export default RequestPage;
