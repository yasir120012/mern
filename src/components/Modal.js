import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          textAlign: "center",
          borderRadius: "10px",
          border: "2px solid #007bff",
          backgroundColor: "#fff",
        },
      }}
    >
      <h2 style={{ color: "#007bff", marginBottom: "20px" }}>{message}</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={onConfirm}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Confirm
        </button>
        <button
          onClick={onRequestClose}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
