import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import OrderEditForm from "./OrderEditForm";
import { Modal } from "react-bootstrap";
import AdminSideNav from "./AdminSide";
import "./Orders-styles.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isEditFormVisible, setEditFormVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://sgl-be.onrender.com/getorders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleEditOrder = (orderId) => {
    const orderToEdit = orders.find((order) => order._id === orderId);

    if (!orderToEdit) {
      console.error(`Order with OrderID ${orderId} not found.`);
      return;
    }

    setEditingOrder(orderToEdit);
    setEditFormVisible(true);
  };

  const handleSaveEditForm = (editedOrder) => {
    const updatedOrders = orders.map((order) =>
      order._id === editingOrder._id ? { ...order, ...editedOrder } : order
    );
    setOrders(updatedOrders);

    // Close the edit form
    setEditFormVisible(false);
    setEditingOrder(null);
    showSuccessAlert("Order Saved!", "success");
  };

  const handleCancelEditForm = () => {
    // Close the edit form without saving
    setEditFormVisible(false);
    setEditingOrder(null);
    showInfoAlert("Cancelled!", "Changes have been discarded.");
  };

  const handleUpdateStatus = (orderId) => {
    showConfirmationAlert(
      "Are you sure?",
      "You want to update the status to Delivered?",
      () => {
        const updatedOrders = orders.map((order) =>
          order._id === orderId ? { ...order, status: "Delivered" } : order
        );
        setOrders(updatedOrders);
        showSuccessAlert("Updated!", "Order status has been updated.");
      }
    );
  };

  const handleCancelOrder = (orderId) => {
    showConfirmationAlert(
      "Are you sure?",
      "You want to cancel the order?",
      () => {
        const updatedOrders = orders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        );
        setOrders(updatedOrders);
        showSuccessAlert("Cancelled!", "Order has been cancelled.");
      }
    );
  };

  const handleRefundOrder = (orderId) => {
    showConfirmationAlert(
      "Are you sure?",
      "You want to refund the order?",
      () => {
        const updatedOrders = orders.map((order) =>
          order._id === orderId ? { ...order, status: "Refunded" } : order
        );
        setOrders(updatedOrders);
        showSuccessAlert("Refunded!", "Order has been refunded.");
      }
    );
  };

  const handleDelete = async (orderId) => {
    try {
      const response = await fetch(
        `https://sgl-be.onrender.com/delete/${orderId}`,
        {
          method: "DELETE",
        }
      );

      console.log(response);

      if (response.ok) {
        // Refresh the orders list after a successful delete
        fetchOrders();
        showSuccessAlert("Deleted!", "Order has been deleted.");
      } else {
        console.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const showConfirmationAlert = (title, text, callback) => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  };

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      icon: "success",
      title,
      text,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const showInfoAlert = (title, text) => {
    Swal.fire({
      icon: "info",
      title,
      text,
    });
  };

  return (
    <div className="orders-page">
      <Modal show={isEditFormVisible} onHide={handleCancelEditForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrderEditForm
            order={editingOrder}
            onSave={handleSaveEditForm}
            onCancel={handleCancelEditForm}
            className="popup-form"
          />
        </Modal.Body>
      </Modal>

      <nav
        className="navbar navbar-expand-lg navbar-light bg-light"
        style={{ marginTop: 0 }}
      >
        <div
          className="container d-flex justify-content-center align-items-center text-center"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <h1
            className="admin-dashboard ms-4 ms-sm-3 mx-auto"
            style={{ maxWidth: "fit-content" }}
          >
            Admin Dashboard
          </h1>
          <div
            onClick={() => {
              navigate("/adminlogin");
            }}
            className="logout-button ms-auto"
          >
            <span className="d-none d-sm-inline">Logout </span>
            <FaSignOutAlt style={{ marginLeft: "8px", fontSize: "1rem" }} />
          </div>
        </div>
      </nav>

      <div id="OrdersWindow" className="container mt-3">
        <div className="row">
          <div className="col-lg-3 mb-0">
            <AdminSideNav />
          </div>
          <div
            className="col-lg-9 shadow p-4 mb-5 bg-white rounded w-lg-100"
            style={{
              transition: "width 0.5s ease",
              maxWidth: "72%", // Initial width
              marginLeft: "6rem",
              marginRight: "0",
              "@media (min-width: 1200px)": {
                maxWidth: "90%", // Adjust the value for large screens
                marginLeft: "auto", // Move to the center for large screens
              },
            }}
          >
            <div className="table-responsive">
              <h1 className="text-dark mb-4 ps-0">Orders</h1>
              <hr
                style={{
                  color: "orange",
                  borderTop: "2px solid orange",
                  width: "50%",
                  marginRight: "auto",
                }}
              />
              <table
                className="table table-bordered table-hover"
                style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
              >
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Items</th>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Address</th>
                    <th>Total Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.userName}</td>
                      <td>{order.items}</td>
                      <td>{order.orderId}</td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>{order.status}</td>
                      <td>{order.address}</td>
                      <td>${order.totalPrice}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(order._id)}
                          style={{ backgroundColor: "#dc3545", color: "#fff" }}
                          className="btn btn-danger m-auto mt-1"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEditOrder(order._id)}
                          style={{ backgroundColor: "#ffc107", color: "#000" }}
                          className="btn btn-warning m-auto mt-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order._id)}
                          style={{ backgroundColor: "#28a745", color: "#fff" }}
                          className="btn btn-success m-auto mt-1"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          style={{ backgroundColor: "#6c757d", color: "#fff" }}
                          className="btn btn-secondary m-auto mt-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRefundOrder(order._id)}
                          style={{ backgroundColor: "#17a2b8", color: "#fff" }}
                          className="btn btn-info m-auto mt-1"
                        >
                          Refund
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
