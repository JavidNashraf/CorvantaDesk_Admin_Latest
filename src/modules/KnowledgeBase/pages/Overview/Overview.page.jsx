import "./styles.scss";
import PendingCard from "./components/PendingCard";
import {getPublicArticles,getUsersSubmissionsCount,getPendingFeedbacksCount } from "store"
import {useDispatch, useSelector} from "react-redux";
import { useEffect } from "react";
import { Spin } from "antd";
import { ArticleCardHome } from "components";
import { useNavigate } from "react-router-dom";

function Overview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {articles, loading,userSubmissionsCount,countLoading} = useSelector((state) => state.articles);
  const {pendingFeedbackCount,pendingCountLoading} = useSelector((state) => state.articlesFeedback);

  useEffect(() => {
    dispatch(getPublicArticles());
    dispatch(getUsersSubmissionsCount());
    dispatch(getPendingFeedbacksCount());
  }, []);
  return (
    <div className="overviewX">
      <div className="pending-o">
        <Spin
        spinning={countLoading}
        >
        <PendingCard title={"Pending User Submissions"}
        count={userSubmissionsCount}
        yellow={true}
        />
        </Spin>
        <Spin
        spinning={pendingCountLoading}
        >
        <PendingCard title={"Pending Feedback Review"}
         count={pendingFeedbackCount}
        />
        </Spin>
      </div>
      <Spin tip={"Loading Please Wait..."}
     spinning={loading}>
      <div className="articles-o">
        <div className="articles-title">
          {"Popular Articles"}
        </div>
        <div className="articles-body">
          {articles?.map((article,index) => (
            <div key={article.id+index} className="articles-item">
              <ArticleCardHome
                key={article.id}
                title={article.title}
                green
                onView={() => navigate(`/admin/dashboard/knowledge-base/articles/view/${article.id}`)}
              />
            </div>
          ))}
        </div>
      </div>
      </Spin>
    </div>
  );
}

export default Overview;