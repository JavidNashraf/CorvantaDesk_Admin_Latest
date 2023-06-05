import {
  Article,
  // GenerateTicket,
  RecentArticle,
} from './sections';
import './View.styles.scss';

export const View = () => {
  return (
    <>
      <div className="p-[40px] ">
        <div className=" bg-[#000000] rounded-[8px]">
          <div className="view-article__box">
            <div className="view-article__box-left pt-[32px] pl-[32px] pr-[20px] pb-[24px]">
              <Article />
            </div>
            <div className="view-article__box-border">
              <div className="view-article__box-right pt-[32px] pr-[20px] pl-[20px]">
                <RecentArticle />
              </div>
            </div>
          </div>
        </div>
        {/* <GenerateTicket /> */}
      </div>
    </>
  );
};
