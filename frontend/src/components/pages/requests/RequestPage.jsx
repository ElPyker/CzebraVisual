import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Space,
  Button,
  Select,
  DatePicker,
  message,
  Upload,
  Switch,
  Tag
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API_URL_REQUESTS } from "../Config";
import NavBarMenu from "./NavBarMenu";
import { apiClient } from "../../../ApiClient";
import styled from "styled-components";
import moment from "moment";

const { Option } = Select;
const buttonColor = "#97b25e";

const ResponsiveTable = styled(Table)`
  .ant-table {
    @media (max-width: 768px) {
      .ant-table-thead > tr > th,
      .ant-table-tbody > tr > td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

const requestTypeMap = {
  DG: "Diseño Gráfico",
  B: "Branding",
  PV: "Video Promocional",
  DC: "Campañas Digitales",
  WD: "Diseño y Desarrollo Web",
};


const ImagePreviewModal = styled(Modal)`
  .ant-modal-content {
    z-index: 1500 !important;
  }
`;

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [currentRequest, setCurrentRequest] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [deleteEnabled, setDeleteEnabled] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

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
      console.error("Error fetching requests:", error);
    }
    setLoading(false);
  };

  const showModal = (request = null) => {
    setCurrentRequest(request);
    setEditMode(!!request);

    if (request) {
      form.setFieldsValue({
        ...request,
        desired_delivery_date: request.desired_delivery_date
          ? moment(request.desired_delivery_date, "YYYY-MM-DD")
          : null,
        is_urgent: request.is_urgent,
      });

      setFileList(
        request.file
          ? [
              {
                uid: request.file,
                name: request.file.split("/").pop(),
                status: "done",
                url: request.file,
              },
            ]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }

    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
  
      formData.append("title", values.title);
      formData.append("name", values.name || "");
      formData.append("request_type", values.request_type);
      formData.append("status", values.status);
      formData.append("details", values.details || "");
      formData.append(
        "desired_delivery_date",
        values.desired_delivery_date
          ? values.desired_delivery_date.format("YYYY-MM-DD")
          : ""
      );
      formData.append("is_urgent", values.is_urgent);
  
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }
  
      // Realiza la solicitud POST para agregar o PUT para editar
      if (editMode) {
        await apiClient.put(
          `${API_URL_REQUESTS}${currentRequest.request_id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await apiClient.post(API_URL_REQUESTS, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      message.success("Request saved successfully");
      fetchRequests();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving request:", error);
      message.error("Error saving request");
    }
  };
  
  

  const handleDelete = async () => {
    try {
      await apiClient.delete(`${API_URL_REQUESTS}${currentRequest.request_id}/`);
      message.success("Request deleted successfully");
      fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
      message.error("Error deleting request");
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const showDeleteModal = (request) => {
    setCurrentRequest(request);
    setIsDeleteModalVisible(true);
  };
  

  const handleFileChange = ({ fileList }) => {
    setFileList([fileList[fileList.length - 1]]);
  };

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Request Type",
      dataIndex: "request_type",
      key: "request_type",
      render: (requestType) => (
        <Tag color="blue">
          {requestTypeMap[requestType] || requestType}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "File",
      dataIndex: "file",
      key: "file",
      render: (file) =>
        file && (
          <img
            src={file}
            alt="Preview"
            style={{ width: 50, cursor: "pointer" }}
            onClick={() => handlePreview({ url: file })}
          />
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => showModal(record)}
            type="link"
            icon={<EditOutlined />}
            style={{ color: buttonColor }}
          />
          <Button
            onClick={() => showDeleteModal(record)}
            type="link"
            icon={<DeleteOutlined />}
            danger
          />
        </Space>
      ),
    },
  ];
  
  

  return (
    <div>
      <NavBarMenu title="Requests" />
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ backgroundColor: buttonColor, borderColor: buttonColor }}
      >
        Add Request
      </Button>
      <ResponsiveTable
        columns={columns}
        dataSource={filteredRequests}
        rowKey="request_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />
      <Modal
        title={editMode ? "Edit Request" : "Add Request"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{
          style: { backgroundColor: buttonColor, borderColor: buttonColor },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item
            name="request_type"
            label="Request Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="DG">Diseño Gráfico</Option>
              <Option value="B">Branding</Option>
              <Option value="PV">Video Promocional</Option>
              <Option value="DC">Campañas Digitales</Option>
              <Option value="WD">Diseño y Desarrollo Web</Option>
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
          <Form.Item
            name="is_urgent"
            label="Is Urgent?"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="details" label="Details">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="file" label="File">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleFileChange}
              onPreview={handlePreview}
              beforeUpload={() => false}
              accept="image/*,video/*"
            >
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <ImagePreviewModal
        title="File Preview"
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        {previewImage && previewImage.endsWith(".mp4") ? (
          <video controls style={{ width: "100%" }} src={previewImage} />
        ) : (
          <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
        )}
      </ImagePreviewModal>
      <Modal
        title="Confirm Deletion"
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText={`Delete${countdown > 0 ? ` (${countdown})` : ""}`}
        okButtonProps={{
          disabled: !deleteEnabled,
          style: { backgroundColor: deleteEnabled ? "red" : "white" },
        }}
      >
        <p>Are you sure you want to delete this request? Please wait {countdown} seconds to confirm deletion.</p>
      </Modal>
    </div>
  );
};

export default RequestPage;
