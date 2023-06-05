import { Modal as BSModal } from 'react-bootstrap';
import './Details.styles.scss';

export function Details({ show, setShow, details }) {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <BSModal show={show} onHide={handleClose} className="details-modal">
      <BSModal.Body className="details-modal__bg">
        <div className="details-modal__header">
          <h3>Invoice Details</h3>
        </div>
        <div className="details-modal__divider" />
        <div className="details-modal__body">
          {/* Details Here */}
          <div className="details-modal__details grid gap-[12px] grid-cols-2 mb-[40px]">
            {details
              ? Object.keys(details)?.map((key, idx) => {
                  const result = key?.replace(/([A-Z])/g, ' $1');
                  const finalResult =
                    result?.charAt(0)?.toUpperCase() + result?.slice(1);
                  return (
                    <div key={`${key}-${idx}`}>
                      <div className="text-gray-500 mb-[8px]">
                        {finalResult}:
                      </div>
                      <div className="text-[16px] rounded-[8px]">
                        {details[key] ? details[key] : 'N/A'}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="details-modal__buttons">
            <button
              onClick={handleClose}
              type="button"
              className="details-modal__buttons-btn details-modal__buttons-btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </BSModal.Body>
    </BSModal>
  );
}
