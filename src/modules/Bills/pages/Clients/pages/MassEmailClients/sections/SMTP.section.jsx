import { Field } from 'formik';

const Info = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center px-[32px] pb-[20px] border-b-[#323248] border-dashed border-b-[1px]">
      <div className="text-[12px] text-white font-normal">{label}</div>
      <div className="text-[12px] text-[#474761] font-normal">{value}</div>
    </div>
  );
};

export const SMTP = () => {
  return (
    <>
      <h6 className="text-white mb-[20px] px-[32px] pb-[32px] text-[16px] border-b-[#323248] border-dashed border-b-[1px]">
        SMTP Configuration
      </h6>
      <div className="flex flex-col gap-[20px] mb-[20px]">
        <Info label="SMTP Configuration" value="Choose Configuration" />
        <Info label="Name" value="Paul Elliot" />
        <Info label="Email Address" value="paul@fakemail.com" />
      </div>
      <div className="flex flex-col gap-[20px]">
        <div className="px-[32px] pb-[20px] border-b-[#323248] border-dashed border-b-[1px]">
          <div className="text-[12px] text-white font-normal">
            Company Address
          </div>
          <div className="text-[12px] text-[#474761] font-normal">
            <Field
              name="companyAddress"
              placeholder="Enter your text here..."
              className="h-[52px] bg-[transparent] placeholder:text-[#92928F] placeholder:text-[16px] text-[#474761] text-[16px]"
            />
          </div>
        </div>
        <div className="px-[32px] pb-[20px]">
          <div className="text-[12px] text-white font-normal">Css Style</div>
          <div className="text-[12px] text-[#474761] font-normal">
            <Field
              name="cssStyle"
              placeholder="Enter your text here..."
              className="h-[52px] bg-[transparent] placeholder:text-[#92928F] placeholder:text-[16px] text-[#474761] text-[16px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};
