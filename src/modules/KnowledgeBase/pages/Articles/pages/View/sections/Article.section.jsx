import { Dropdown, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getArticleByID } from "store";
import "./Article.styles.scss";
import { Delete } from "./Delete.section";

export const Article = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getArticleByID({ id }));
  }, [id]);

  const navigate = useNavigate();

  const [showDel, setShowDel] = useState(false);

  const { article, loading } = useSelector((state) => state?.articles);
  const [imgError, setImgError] = useState(false);

  return (
    <Spin spinning={loading}>
      <div>
        <Delete show={showDel} setShow={setShowDel} id={id} />
        <div className="flex flex-row justify-between items-center ">
          <h5 className="font-medium text-[24px] text-white">
            {article?.title ? article?.title : "No Title Found"}
          </h5>
          <div className="flex gap-[8px]">
            <div className="px-[8px] py-[4px] bg-[#323248] rounded-[4px] text-white font-medium text-[10px] uppercase">
              {article?.visibility ? "Public Article" : "Private Articlew"}
            </div>
            <div className="px-[8px] py-[4px] bg-[#2F264F] rounded-[4px] text-[#8950FC] font-medium text-[10px] uppercase">
              {article?.articleCategories?.length
                ? article?.articleCategories[0]?.category?.name
                : "N/A"}
            </div>
          </div>
        </div>
        <div className="mt-[12px]">
          <p className="text-[#474761] text-[14px]">
            {/* By Paul Elliott On Feb 20th, 2022 */}
          </p>
        </div>
        <div className="relative w-full mt-[32px]">
          {article?.base64Image && !imgError ? (
            <img
              className="h-[492px] w-full rounded-[8px] object-cover"
              src={article?.base64Image}
              onError={() => setImgError(true)}
              alt="article"
            />
          ) : (
            <div className="h-[492px] w-full rounded-[8px] object-cover border-1 border-blue-600 flex items-center justify-center text-white text-[16px] font-medium">
              No Image Found
            </div>
          )}

          <Dropdown
            trigger="click"
            placement="bottomRight"
            overlay = {
              <div className="rounded-[8px] custom-article-card__more-dd z-50 flex flex-col gap-[20px] min-w-[120px] py-[20px] px-[12px]">
                <button
                  className="text-[#FFFFFF] text-[12px] hover:text-[#3699FF] text-left"
                  onClick={() =>
                    navigate(
                      `/admin/dashboard/knowledge-base/articles/edit/${id}`
                    )
                  }
                >
                  Edit
                </button>
                <button
                  className="text-[#FFFFFF] text-[12px] hover:text-[#3699FF] text-left"
                  onClick={() => {
                    setShowDel(true);
                  }}
                >
                  Delete
                </button>
              </div>
            }
          >
            <div className="p-[8px] absolute h-[32px] w-[32px] top-[12px] right-[12px] article-dropdown__more cursor-pointer">
              <img src="/icon/more.svg" alt="more" />
            </div>
          </Dropdown>
        </div>
        <div className="mt-[32px]">
          <p
            className="text-[#92928F] text-[16px]"
            dangerouslySetInnerHTML={{ __html: article?.bodyText }}
          />

          {/* </p> */}
        </div>
      </div>
    </Spin>
  );
};
