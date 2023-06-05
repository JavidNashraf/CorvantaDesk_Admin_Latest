import { Spin } from 'antd';
import { Input, MultiSelect, Button } from 'components';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllEmailTemplates } from 'store';
import { getAllSMTPs } from 'store';
import { getProducts } from 'store';
import { findSpecificUsers } from 'store';

export const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state?.products);
  const { smtps } = useSelector((state) => state?.smtps);
  const { emailTemplates } = useSelector((state) => state?.emailTemplates);
  const smtpsLoading = useSelector((state) => state?.smtps?.loading);
  const emailTemplatesLoading = useSelector(
    (state) => state?.emailTemplates?.loading
  );
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    (async () => {
      await dispatch(getProducts());
      await dispatch(getAllSMTPs());
      await dispatch(getAllEmailTemplates());
    })();
  }, []);

  const [emailTemplate, setEmailTemplate] = useState(null);

  useEffect(() => {
    if (emailTemplate) {
      const template = emailTemplates?.find(
        (temp) => temp?.id === emailTemplate
      );
      const smtpServer = smtps?.find(
        (smtp) => smtp?.id === template?.smtpConfigurationId
      );
      setFieldValue('emailTemplateContent', template);
      setFieldValue('headerContent', smtpServer?.headerContent);
      setFieldValue('footerContent', smtpServer?.footerContent);
      setFieldValue('signatureContent', smtpServer?.signature);
      setFieldValue('smtpConfigId', template?.smtpConfigurationId);
    } else {
    }
  }, [emailTemplate]);

  return (
    <Spin spinning={loading || emailTemplatesLoading || smtpsLoading}>
      <div className="flex flex-col gap-[20px]">
        <h6 className="text-white text-[16px]">Products & Services</h6>
        <MultiSelect
          name="productIds"
          placeholder="Select Products & Services"
          options={products?.map((product) => ({
            label: product?.name,
            value: product?.id,
          })) || []}
        />
        <h6 className="text-white text-[16px]">Email Template</h6>
        <Input
          type="select"
          name="emailTemplate"
          placeholder="Select Email Template"
          customOnChange={(e) => {
            setEmailTemplate(e?.target?.value);
          }}
          options={emailTemplates?.map((emailTemplates) => ({
            label: emailTemplates?.subject,
            value: emailTemplates?.id,
          })) || []}
        />
        <h6 className="text-white text-[16px]">SMTP Configuration</h6>
        <Input
          type="select"
          name="smtpConfigId"
          placeholder="Select SMTP Configuration"
          options={smtps?.map((smtp) => ({
            label: smtp?.host,
            value: smtp?.id,
          })) || []}
        />
        <h6 className="text-white text-[16px]">Targeted Clients</h6>
        <div className="flex flex-col gap-[20px]">
          <Input
            label="Property"
            type="select"
            name="property"
            placeholder="Select Property"
            options={[
              { label: 'Show All', value: '' },
              { label: 'Bills', value: 0 },
              { label: 'Tickets', value: 1 },
              { label: 'Orders', value: 2 },
              { label: 'Products', value: 3 },
              { label: 'Refunds', value: 4 },
            ]}
          />
          <Input
            label="Operator"
            type="select"
            name="operatorType"
            placeholder="Select Operator"
            options={[
              { label: 'Show All', value: '' },
              { label: '>=', value: '>=' },
              { label: '<=', value: '<=' },
              { label: '<', value: '<' },
              { label: '>', value: '>' },
              { label: '=', value: '=' },
              { label: '!=', value: '!=' },
            ]}
          />
          <Input
            label="Value"
            type="text"
            name="value"
            placeholder="Enter Value"
          />
          <Button
            type="ghost"
            className="h-[52px] w-full"
            htmlType="button"
            onClick={async () => {
              if (values?.property && values?.operatorType && values?.value) {
                const { property, operatorType, value } = values;
                await dispatch(
                  findSpecificUsers({
                    property: Number(property),
                    operatorType,
                    value,
                  })
                );
              } else {
                toast.error('Please select appropriate values to proceed.');
              }
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </Spin>
  );
};
