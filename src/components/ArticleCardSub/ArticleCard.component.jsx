import { Dropdown } from 'antd';
import { useState } from 'react';
import './ArticleCard.styles.scss';

export const ArticleCardSub = ({
  title,
  bodyText,
  imagePath,
  articleCategories,
  onView,
  onEdit,
  onDelete,
  onGenerateTicket,
  onApprove,
  articleType,
  base64Image,
}) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="p-[32px] bg-[#000000] flex flex-col gap-[32px] custom-article-card rounded-[8px]">
      <div className="relative h-[204px] w-full">
        {base64Image && !imgError ? (
          <img
            className="h-[204px] w-full rounded-[8px] object-cover"
            onError={() => setImgError(true)}
            src={base64Image}
            alt={title}
          />
        ) : (
          <div className="h-[204px] w-full rounded-[8px] object-cover border-1 border-blue-600 flex items-center justify-center text-white text-[16px] font-medium text-center">
            No Image Available
          </div>
        )}
        <Dropdown
          trigger="click"
          placement="bottomRight"
          overlay = {
            <div className="rounded-[8px] custom-article-card__more-dd z-50 flex flex-col gap-[20px] min-w-[120px] py-[20px] px-[12px]">
              {onView && (
                <button
                  className="text-[#ffffff] text-[12px] hover:text-[#3699FF] text-left"
                  onClick={onView}
                >
                  Review Submission
                </button>
              )}
              {onEdit && (
                <button
                  className="text-[#ffffff] text-[12px] hover:text-[#3699FF] text-left"
                  onClick={onEdit}
                >
                  Edit Submission
                </button>
              )}
              {onDelete && (
                <button
                  className="text-[#ffffff] text-[12px] hover:text-[#3699FF] text-left"
                  onClick={onDelete}
                >
                  Delete
                </button>
              )}
              {onGenerateTicket && (
                <button
                  className="text-[#ffffff] text-[12px] hover:text-[#3699FF] text-left"
                  onClick={onGenerateTicket}
                >
                  Generate Ticket
                </button>
              )}
              {onApprove && (
                <button
                  className="text-[#ffffff] text-[12px] hover:text-[#3699FF] text-left"
                  onClick={onApprove}
                >
                  Approve
                </button>
              )}
            </div>
          }
        >
          <div className="p-[8px] absolute h-[32px] w-[32px] top-[12px] right-[12px] custom-article-card__more cursor-pointer">
            <img src="/icon/more.svg" alt="more" />
          </div>
        </Dropdown>
      </div>
      <div className="flex flex-col gap-[8px]">
        <h5 className="font-medium text-[24px] text-white">{title}</h5>
        <div className="flex gap-[8px]">
          <div className="px-[8px] py-[4px] bg-[#323248] rounded-[4px] text-white font-medium text-[10px] uppercase">
            {articleType}
          </div>
          <div className="px-[8px] py-[4px] bg-[#2F264F] rounded-[4px] text-[#8950FC] font-medium text-[10px] uppercase">
            {articleCategories?.length
              ? articleCategories[0]?.category?.name
              : 'Uncategorized'}
          </div>
        </div>
      </div>
      <div>
        <p
          className=" bodyX text-[#92928F] text-[16px]"
          dangerouslySetInnerHTML={{ __html: bodyText?.substring(0, 155) }}
        />
      </div>
      <div>
        <p className="text-[#474761] text-[14px]">
          {/* By Paul Elliott On Feb 20th, 2022 */}
        </p>
      </div>
    </div>
  );
};
