import { Progress as ProgressBar } from "antd";
import { Modal } from "components";
import { useDispatch, useSelector } from "react-redux";
import { setImportError } from "store";
import { setImportProgres } from "store";

// status === 'importing' || 'success' || 'failed'

export const Progress = ({ show, setShow, status, percent, setStep }) => {
  let statusText;
  switch (status) {
    case "importing":
      statusText = "Importing...";
      break;
    case "failed":
      statusText = "Import Failed";
      break;
    case "success":
      statusText = "Import Successfull";
      break;
    default:
      statusText = "Importing...";
      break;
  }

  const dispatch = useDispatch();
  const { importError } = useSelector((state) => state?.whmcs);

  return (
    <Modal
      show={show}
      setShow={setShow}
      heading="Import Progress"
      cancelButtonText="Close"
      submitText=""
      handleCancel={async () => {
        if (!importError) {
          await dispatch(setImportProgres(0));
          setStep(1);
        } else {
          await dispatch(setImportProgres(0));
          await dispatch(setImportError(null));
        }
        setShow(false);
      }}
      centered
      customBody={
        <div className="mb-[32px]">
          <div
            className={`${
              status === "failed" ? "text-[#f64e60]" : "text-[#0bb783]"
            }`}
          >
            {statusText}
          </div>
          <ProgressBar
            percent={percent}
            format={(percent) => <div className="text-white">{percent}%</div>}
            strokeColor={status === "failed" ? "#F64E60" : "#0BB783"}
            trailColor="#323248"
          />
        </div>
      }
    />
  );
};
