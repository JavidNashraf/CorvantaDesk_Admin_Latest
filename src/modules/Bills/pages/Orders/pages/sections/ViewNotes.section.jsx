import { Modal as BSModal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export const ViewNotes = ({ show, setShow, notesValue }) => {
  const { t } = useTranslation("/Bills/ns");
  const handleClose = () => {
    setShow(false);
  };
  return (
    <BSModal show={show} onHide={handleClose} className={`custom-modal`}>
      <BSModal.Body className="modal__bg">
        <div className="modal__header">
          <h3>{t("viewNotes")}</h3>
        </div>
        <div className="modal__divider" />
        <div className="modal__body">
          <p className="modal__form-el-label">{notesValue?.notes}</p>
        </div>
      </BSModal.Body>
    </BSModal>
  );
};
