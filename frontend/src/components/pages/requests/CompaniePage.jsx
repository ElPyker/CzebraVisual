import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, Select, message, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { API_URL_COMPANIES } from '../Config';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

const buttonColor = '#97b25e';

const CompaniePage = () => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentCompany, setCurrentCompany] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentCompanyId, setCurrentCompanyId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, companies]);

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

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_COMPANIES);
            setCompanies(response.data);
            setFilteredCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
            message.error('Error fetching companies');
        }
        setLoading(false);
    };

    const showModal = (company = null) => {
        setCurrentCompany(company);
        setEditMode(!!company);
        if (company) {
            form.setFieldsValue(company);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                name: values.name,
                code: values.code,
                email: values.email,
                phone: values.phone,
                address: values.address,
                status: values.status,
            };

            if (editMode) {
                await apiClient.put(`${API_URL_COMPANIES}${currentCompany.company_id}/`, data);
                message.success('Company updated successfully');
            } else {
                await apiClient.post(API_URL_COMPANIES, data);
                message.success('Company added successfully');
            }
            fetchCompanies();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving company:', error);
            message.error('Error saving company');
        }
    };

    const showDeleteModal = (companyId) => {
        setCurrentCompanyId(companyId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_COMPANIES}${currentCompanyId}/`);
            fetchCompanies();
            message.success('Company deleted successfully');
        } catch (error) {
            console.error('Error deleting company:', error);
            message.error('Error deleting company');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = companies.filter(company =>
            (company.name && company.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (company.code && company.code.toLowerCase().includes(searchText.toLowerCase())) ||
            (company.email && company.email.toLowerCase().includes(searchText.toLowerCase())) ||
            (company.phone && company.phone.toLowerCase().includes(searchText.toLowerCase())) ||
            (company.address && company.address.toLowerCase().includes(searchText.toLowerCase())) ||
            (company.status && company.status.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredCompanies(filtered);
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
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
                            onClick={() => showDeleteModal(record.company_id)}
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
            {/* <NavBarMenu title="Companies" /> */}
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Input
                    placeholder="Search Company..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={() => showModal()} style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                    Add Company
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredCompanies}
                rowKey="company_id"
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
                title={editMode ? 'Edit Company' : 'Add Company'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okButtonProps={{ style: { backgroundColor: buttonColor, borderColor: buttonColor } }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
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
                <p>Are you sure you want to delete this company? Please wait {countdown} seconds to confirm deletion.</p>
            </Modal>
        </div>
    );
};

export default CompaniePage;
