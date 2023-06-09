import moment from "moment";
import { Table } from "components";
import "./Logs.styles.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { checkModule } from "lib/checkModule";
import { getLogsByUserID } from "store";
import { exportToExcel } from "lib";

export const Logs = () => {
  const [data, setData] = useState([]);

  const { t } = useTranslation("/Users/ns");

  const { logs, loading } = useSelector((state) => state?.logs);
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Users",
    modules: userModules,
  });

  const { user } = useSelector((state) => state?.users);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLogsByUserID(user?.id));
  }, []);

  const columns = [
    {
      title: t("status"),
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <div className="bg-[#1C3238] px-[8px] py-[4px] text-[#0BB783] w-[fit-content] rounded-[4px]">
          {status}
        </div>
      ),
    },
    {
      title: t("url"),
      key: "url",
      dataIndex: "url",
    },
    {
      title: t("reqDate"),
      key: "reqDate",
      dataIndex: "reqDate",
    },
  ];

  // Set Data to Fetched Logs
  useEffect(() => {
    const dataHolder = [];
    logs.forEach((log) => {
      dataHolder.push({
        key: log.id,
        status: "200 OK",
        url: `${log.type} ${log.tableName}`,
        reqDate: moment(log.dateTime).format(
          "dddd, MMMM Do, YYYY [at] h:mm:ss a"
        ),
      });
    });
    setData(dataHolder);
  }, [logs]);

  return (
    <div className="mt-[20px] bg-[#000000] rounded-[8px]">
      <h6 className="text-white text-[16px] px-[32px] pt-[32px]">
        {t("logs")}
      </h6>
      <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[32px] mb-[32px]" />
      <div className="up-custom-logs__table pb-[30px]">
        <Table
          data={data}
          columns={columns}
          fieldToFilter={"url"}
          t={t}
          btnData={{
            text: "Download Logs",
            onClick: () => {
              exportToExcel(logs);
            },
          }}
          pagination={{
            pageSize: 5,
            position: ["bottomRight"],
            showSizeChanger: false,
          }}
          hideActions
          hideHeaders
          permissions={permissions}
          loading={loading}
        />
      </div>
    </div>
  );
};
