import React from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";

// Komponen Konfirmasi
const ConfirmAlert = ({ title, message, buttons, onClose }) => {
  return createPortal(
    <div className="confirm-overlay">
      <div className="confirm-box" >
        <h2 className="confirm-title">{title}</h2>
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => {
                btn.onClick?.();
                onClose();
              }}
              className="confirm-btn"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Fungsi untuk panggil alert
const confirmAlert = ({ title, message, buttons }) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  const close = () => {
    root.unmount(); // ✅ FIX INI
    container.remove();
  };

  root.render(
    <ConfirmAlert
      title={title}
      message={message}
      buttons={buttons}
      onClose={close}
    />
  );
};

export default confirmAlert;