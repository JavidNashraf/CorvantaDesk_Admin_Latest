import { Next } from 'icons';
import { useTranslation } from 'react-i18next';

const Email = ({
  title = 'Email Title',
  desc = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.',
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-[16px] items-center">
          <div className="w-[3px] h-[70px] bg-[#8950FC] text-white flex items-center justify-center rounded-[8px]" />
          <div className="flex flex-col gap-[8px]">
            <div className="flex gap-[12px] items-center">
              <div className="text-white text-base text-[16px]">{title}</div>
            </div>
            <div className="text-[#474761]">{desc}</div>
          </div>
        </div>
        <div className="bg-[#323248] p-[8px] rounded-[8px] cursor-pointer">
          <Next />
        </div>
      </div>
      <div className="h-0 w-full border-t-[1px] border-dashed border-[#323248] mt-[16px]" />
    </div>
  );
};

export const PastEmails = () => {
  const { t } = useTranslation('/Users/ns');

  return (
    <div className="mt-4 p-[32px] bg-[#000000] rounded-[8px]">
      <h6 className="text-white mb-[32px]">{t('pastEmails')}</h6>

      <div className="flex flex-col gap-[16px] justify-center">
        <Email />
        <Email />
        <Email />
        <Email />
      </div>
    </div>
  );
};
