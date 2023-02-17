import React from "react";
import Modal from "@material-ui/core/Modal";

export const ModalWindow = ({ ...props }) => {
  const { children, open, handleClose } = props;

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        {children}
      </Modal>
    </div>
  );
};
