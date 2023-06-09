import { Modal as BSModal } from "react-bootstrap";
import { Button } from "components";
import { onLoginDispatch } from "store/Slices/authSlice";
import { useDispatch } from "react-redux";

export function SimpleModal({
  children,
  show,
  setShow,
  heading,
  loading,
  disabled,
  submitText,
  submitButtonType = "primary",
  submitButtonClass,
  cancelButtonText = "Cancel",
  cancelButtonClass,
  handleSubmit,
  handleCancel,
}) {
  const dispatch = useDispatch();
  const handleClose = () => {
    setShow(false);
    dispatch(onLoginDispatch(false))
  };
  
  return (
    <BSModal show={show} onHide={handleClose}>
      <BSModal.Body className="p-0 modal__bg">
        <div className="p-8 pb-0 modal__header">
          <h3>{heading}</h3>
        </div>
        <div className="modal__divider" />
        <div className="p-8 pt-0 modal__body">
          <div className="mb-[12px] modal__form">
            {children}
          </div>

          <div className="flex flex-col modal__buttons">
            {submitText && (
              <Button
                type={submitButtonType}
                loading={loading}
                disabled={disabled || false}
                className={`h-[52px] ${submitButtonClass}`}
                onClick={() => {
                  dispatch(onLoginDispatch(true));
                  handleSubmit()
                
                }}
              >
                {submitText}
              </Button>
            )}

            {cancelButtonText && (
              <Button
                className={`modal__buttons-btn modal__buttons-btn-secondary h-[52px] ${cancelButtonClass}`}
                onClick={handleCancel ? handleCancel : handleClose}
              >
                {cancelButtonText}
              </Button>
            )}
          </div>
        </div>
      </BSModal.Body>
    </BSModal>
  );
}
