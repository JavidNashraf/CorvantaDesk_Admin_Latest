import { Button } from "antd";
import { SimpleModal } from "components";
import { DateRangePicker, MultiSelect } from "components";
import { Form, Formik } from "formik";
import moment from "moment";
import { getReportsForDownload } from "store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";

const options = [
  {
    label: "Products",
    value: "Products",
  },
  {
    label: "Credits",
    value: "Credits",
  },
  {
    label: "Billing",
    value: "Billing",
  },
  {
    label: "Transactions",
    value: "Transactions",
  },
  {
    label: "Tickets",
    value: "Tickets",
  },
  {
    label: "SubUsers",
    value: "SubUsers",
  },
  {
    label: "APIKeys",
    value: "APIKeys",
  },
  {
    label: "Logs",
    value: "Logs",
  },
  {
    label: "KnowledgeBase",
    value: "KnowledgeBase",
  },
];

export const DownloadData = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const userId = user?.id;
  const clientName = user?.fullName;

  const [disabled, setDisabled] = useState(true);
  const [selection, setSelection] = useState(false);
  const [date, setDate] = useState(false);

  const handleDonwload = async ({ dataKs, startDate, endDate }) => {
    const moduletype = dataKs.join(",");
    setDisabled(false);
    dispatch(
      getReportsForDownload({
        moduletype,
        userId,
        startDate,
        endDate,
        clientName,
      })
    );
    
  };

  const handleChangeMultiSelect = (e) => {
    
    if (e.length > 0) {
      // console.log("multi",e)
      setSelection(true);
    } else {
      setDisabled(true);
    }
  };

  const handleChangeDateRanger = (e) => {
    
    if (e.length > 0) {
      // console.log("date",e)
      setDate(true);
    } else {
      setDisabled(true);
    }
  };

  const handleCancel = () => {
    setDisabled(true);
    setDate(false);
    setSelection(false);
    setShow(false);
  }

  useMemo(() => {
    if (selection && date) {
      setDisabled(false);
    }else{
      setDisabled(true);
    }
  }, [selection, date]);

  return (
    <SimpleModal
      show={show}
      setShow={setShow}
      heading="Download Data"
      cancelButtonText="Go Back"
      handleCancel={handleCancel}
    >
      <Formik
        onSubmit={async (values) => {
          const startDate = moment(values?.dates[0]).toISOString();
          const endDate = moment(values?.dates[1])?.toISOString();
          const dataKs = values?.data;
          await handleDonwload({
            dataKs,
            startDate,
            endDate,
          });
        }}
        initialValues={{ dates: "" }}
      >
        <Form className="flex flex-col items-center gap-[20px]">
          <div className="flex justify-end w-full">
            <Button
              type="primary"
              className="custom-table__btn px-[32px]"
              htmlType="submit"
              disabled={disabled}
            >
              Download Data
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="w-[100px]">Data Type</span>
            <MultiSelect
              name="data"
              options={options}
              mode="multiple"
              placeholder={"Select Date Type"}
              onChange={(e) => handleChangeMultiSelect(e)}
            />
          </div>
          <div className="flex items-center justify-between w-full">
            <span>Date</span>
            <div className="min-w-[200px]">
              <DateRangePicker
                name="dates"
                onChange={(e) => handleChangeDateRanger(e)}
              />
            </div>
          </div>
        </Form>
      </Formik>
    </SimpleModal>
  );
};
