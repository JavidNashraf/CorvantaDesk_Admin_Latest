import { Button, Select, Tooltip } from "antd";
import { Copy, Down } from "icons";
import { Table } from "components";
import "./APIKeys.styles.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkModule } from "lib/checkModule";

export const APIKeys = () => {
  const [selectedSort, setSelectedSort] = useState("label");
  const [data, setData] = useState([]);

  const { t } = useTranslation("/Users/ns");

  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Users",
    modules: userModules,
  });

  const columns = [
    {
      title: t("label"),
      dataIndex: "label",
      key: "label",
    },
    {
      title: t("apiKey"),
      dataIndex: "apiKey",
      key: "apiKey",
      render: (text) => {
        return (
          <div className="flex gap-[8px] items-center">
            <div>{text}</div>
            <Tooltip title="Copied!" trigger="click">
              <div
                onClick={() => {
                  navigator.clipboard.writeText(text);
                }}
                className="cursor-pointer"
              >
                <Copy />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: t("validTill"),
      key: "validTill",
      dataIndex: "validTill",
    },
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
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  useEffect(() => {
    const data = [];
    for (let i = 10; i > 0; i--) {
      data.push({
        key: i,
        label: `API Key ${i}`,
        apiKey: `${i}0asdwr${i}asd${i}`,
        createdAt: "Sunday, March 27th, 2022 at 04:30 PM",
        status: `ACTIVE`,
      });
    }

    data.sort((a, b) => {
      if (a[selectedSort] && b[selectedSort]) {
        return a?.[selectedSort]?.localeCompare(b?.[selectedSort]);
      }
      return a > b;
    });
    setData(data);
  }, [selectedSort]);

  const onSelectChange = (e) => {
    setSelectedSort(e);
  };

  return (
    <div className="mt-[20px] bg-[#000000] rounded-[8px]">
      <h6 className="text-white text-[16px] px-[32px] pt-[32px]">API Keys</h6>
      <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[32px] mb-[32px]" />
      <div className="api-keys__table">
        <Table
          data={data}
          columns={columns}
          btnData={{ text: "Add API Key", onClick: () => {} }}
          fieldToFilter="label"
          pagination={false}
          rowSelection={rowSelection}
          permissions={permissions}
          editAction={(record) => {
            return (
              <>
                {/* TODO: Replace with UID */}
                <Button onClick={() => {}}>Enable</Button>
                <Button>Disable</Button>
              </>
            );
          }}
          t={t}
          customFilterSort={
            <>
              <Select
                className="min-w-[235px] bg-[#171723]"
                onChange={onSelectChange}
                dropdownClassName="custom-select-dropdown"
                value={selectedSort}
                suffixIcon={<Down />}
              >
                {columns?.map((el) => {
                  return (
                    <Select.Option key={el?.key} value={el?.key}>
                      {t("sortBy")} {el?.title}
                    </Select.Option>
                  );
                })}
              </Select>
            </>
          }
        />
      </div>
    </div>
  );
};
