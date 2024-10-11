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
  Tooltip,
  Upload,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { API_URL_REQUESTS } from "../Config";
import NavBarMenu from "./NavBarMenu";
import { apiClient } from "../../../ApiClient";
import moment from "moment";

const { Option } = Select;

const buttonColor = "#97b25e";

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [currentRequest, setCurrentRequest] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fileList, setFileList] = useState([]);

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
        (request.files || []).map((file, index) => {
          const fileUrl = file.url || file; // Si el archivo ya tiene un url
          const fileType = fileUrl.endsWith(".mp4")
            ? "video/mp4"
            : "image/jpeg";
          const fileName = fileUrl.split("/").pop();
          return {
            uid: index,
            name: fileName || `file-${index}`,
            status: "done",
            url: fileUrl,
            type: fileType,
          };
        })
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
      const data = {
        user: values.user,
        company: values.company,
        title: values.title,
        name: values.name,
        request_type: values.request_type,
        status: values.status,
        details: values.details,
        desired_delivery_date: values.desired_delivery_date
          ? values.desired_delivery_date.format("YYYY-MM-DD")
          : null,
        is_urgent: values.is_urgent,
        files: fileList.map((file) => file.originFileObj || file.url),
      };

      if (editMode) {
        await apiClient.put(
          `${API_URL_REQUESTS}${currentRequest.request_id}/`,
          data
        );
        message.success("Request updated successfully");
      } else {
        await apiClient.post(API_URL_REQUESTS, data);
        message.success("Request added successfully");
      }
      fetchRequests();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving request:", error);
      if (error.response && error.response.data) {
        console.error("Server response:", error.response.data);
      }
      message.error("Error saving request");
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const showDeleteModal = (requestId) => {
    setCurrentRequestId(requestId);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`${API_URL_REQUESTS}${currentRequestId}/`);
      fetchRequests();
      message.success("Request deleted successfully");
    } catch (error) {
      console.error("Error deleting request:", error);
      message.error("Error deleting request");
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const handleSearchChange = (searchText) => {
    setSearchText(searchText);
    const filtered = requests.filter(
      (request) =>
        (request.title &&
          request.title.toLowerCase().includes(searchText.toLowerCase())) ||
        (request.code &&
          request.code.toLowerCase().includes(searchText.toLowerCase())) ||
        (request.name &&
          request.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (request.request_type &&
          request.request_type
            .toLowerCase()
            .includes(searchText.toLowerCase())) ||
        (request.status &&
          request.status.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredRequests(filtered);
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
    { title: "Request Type", dataIndex: "request_type", key: "request_type" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Desired Delivery Date",
      dataIndex: "desired_delivery_date",
      key: "desired_delivery_date",
    },
    {
      title: "Is Urgent?",
      dataIndex: "is_urgent",
      key: "is_urgent",
      render: (is_urgent) => (is_urgent ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
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
      <Table
        columns={columns}
        dataSource={filteredRequests}
        rowKey="request_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
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
          <Form.Item name="files" label="File">
            <Upload
              fileList={fileList}
              onPreview={handlePreview}
              onChange={({ fileList }) =>
                setFileList([fileList[fileList.length - 1]])
              } // Mantener solo el último archivo seleccionado
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        {previewFile?.type.startsWith("image/") && (
          <img alt="preview" style={{ width: "100%" }} src={previewFile.url} />
        )}
        {previewFile?.type.startsWith("video/") && (
          <video controls style={{ width: "100%" }} src={previewFile.url} />
        )}
      </Modal>
    </div>
  );
};

export default RequestPage;
