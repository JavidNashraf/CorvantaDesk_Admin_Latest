import { Formik, Form, Field } from "formik";
import { Spin, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { getUserSettingsById } from "store";
import { updateUserSettings } from "store";
import { DatePicker, Input, MultiSelect } from "components";
import { deepEqual } from "lib";

export const Settings = () => {
  const { t } = useTranslation("/Users/ns");
  const [loading, setLoading] = useState(false);

  const { user, userSettings } = useSelector((state) => state?.users);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (user) {
  //     (async () => {
  //       setLoading(true);
  //       await dispatch(getUserSettingsById(user?.id));
  //       setLoading(false);
  //     })();
  //   }
  // }, [user]);

  const initialValues = {
    clientStatus: userSettings?.clientStatus,
    requestPerIPOverride: userSettings?.requestPerIPOverride
      ? userSettings?.requestPerIPOverride
      : 0,
    ipRestrictionIntervalOverrideInSeconds:
      userSettings?.ipRestrictionIntervalOverrideInSeconds
        ? userSettings?.ipRestrictionIntervalOverrideInSeconds
        : 0,
    apiKeyLimitOverride: userSettings?.apiKeyLimitOverride
      ? userSettings?.apiKeyLimitOverride
      : 0,
    apiKeyIntervalOverrideInSeconds:
      userSettings?.apiKeyIntervalOverrideInSeconds
        ? userSettings?.apiKeyIntervalOverrideInSeconds
        : 0,
    restrictAccessToIPAddress: userSettings?.restrictAccessToIPAddress
      ? userSettings?.restrictAccessToIPAddress
      : [],
    maxCreditAmount: userSettings?.maxCreditAmount ?? 0,
    isActiveOrPendingProduct: userSettings?.isActiveOrPendingProduct ?? true,
    userId: user?.id,
    id: userSettings?.id,
  };

  const fields = [
    { label: "Client Status", name: "clientStatus", type: "switch" },
    {
      label: "Request Per IP Override",
      name: "requestPerIPOverride",
      type: "number",
    },
    {
      label: t("IPRestrictionOverride"),
      name: "ipRestrictionIntervalOverrideInSeconds",
      type: "number",
    },
    { label: t("apiKeyLimit"), name: "apiKeyLimitOverride", type: "number" },
    {
      label: t("apiKeyInterval"),
      name: "apiKeyIntervalOverrideInSeconds",
      type: "input",
    },

    {
      type: "multiselect",
      name: "restrictAccessToIPAddress",
      placeholder: "253.205.121.39",
      label: "Restrict to IP Addresses",
      mode: "tags",
      options:
        userSettings?.restrictAccessToIPAddress?.length > 0
          ? userSettings?.restrictAccessToIPAddress?.map((ip) => ({
              label: ip,
              value: ip,
            }))
          : null,
    },
    { label: "Active/Pending Product", name: "isActiveOrPendingProduct", type: "switch" },
    {
      label: "Maximum Credit Amount",
      name: "maxCreditAmount",
      type: "number",
    },
  ];

  return (
    <div className="bg-[#000000] mt-[20px] rounded-[8px]">
      <h6 className="text-white text-[16px] px-[32px] pt-[32px]">
        {t("settings")}
      </h6>
      <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[32px] mb-[32px]" />
      {/* FORM ROW */}
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          setLoading(true);
          const finalValues = {
            ...values,
            extendSuspensionDate: values?.extendSuspensionDate?.toISOString(),
          };
          await dispatch(updateUserSettings({ data: finalValues }));
          setLoading(false);
        }}
        enableReinitialize
      >
        {({ values }) => {
          return (
            <Form className="pb-[32px]">
              <Spin spinning={loading}>
                <div className="grid grid-cols-3 p-[32px] gap-[20px] items-end">
                  {fields?.map((el) => {
                    return (
                      <Fragment key={el?.name}>
                        {el?.type === "date" ? (
                          <div className="w-full">
                            <div className="text-white mb-[12px] text-[14px]">
                              {el?.label}
                            </div>
                            <DatePicker name={el?.name} />
                          </div>
                        ) : el?.type === "switch" ? (
                          <Field name={el?.name}>
                            {({
                              field, // { name, value, onChange, onBlur }
                              form: { setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                              meta,
                            }) => (
                              <div className="w-full">
                                <div className="text-white mb-[12px] text-[14px]">
                                  {el?.label}
                                </div>
                                <div className="flex items-center justify-between w-full h-[52px] px-[16px] py-[0px] bg-[#171723] text-[#92928F] rounded-[8px]">
                                  <div className="text-[#92928F]">
                                    {field?.value ? "Enabled" : "Disabled"}
                                  </div>
                                  <Switch
                                    checked={field?.value}
                                    onChange={(e) => {
                                      setFieldValue(el?.name, e);
                                    }}
                                  />
                                </div>
                                {meta.touched && meta.error && (
                                  <div className="error">{meta.error}</div>
                                )}
                              </div>
                            )}
                          </Field>
                        ) : el?.type === "multiselect" ? (
                          <div className="w-full">
                            <div className="text-white mb-[12px] text-[14px]">
                              {el?.label}
                            </div>
                            <MultiSelect
                              name={el?.name}
                              options={el?.options}
                              placeholder={el?.placeholder}
                              mode={el?.mode}
                              disabled={false}
                              className="bg-[#171723]"
                            />
                          </div>
                        ) : (
                          <Input
                            key={el.name}
                            name={el.name}
                            label={el?.label}
                            placeholder={el.placeholder}
                            type={el.type}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
                <div className="flex items-center gap-[10px] px-[32px]">
                  <button
                    type="button"
                    className="bg-[#323248] text-white rounded-[8px] py-[12px] px-[24px]"
                  >
                    {t("discard")}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#3699FF] text-white rounded-[8px] py-[12px] px-[24px] disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={deepEqual(initialValues, values)}
                  >
                    {t("saveChanges")}
                  </button>
                </div>
              </Spin>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
