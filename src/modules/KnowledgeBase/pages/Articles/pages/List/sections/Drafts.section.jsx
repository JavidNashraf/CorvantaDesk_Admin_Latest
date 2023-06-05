import { List } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArticleCard } from 'components';
import { Delete } from './Delete.section';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDraftArticles } from 'store';
import './styles.scss';

export function Drafts() {
  const [showDel, setShowDel] = useState(false);
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { articles, loading } = useSelector((state) => state?.articles);

  useEffect(() => {
    dispatch(getDraftArticles());
  }, []);

  return (
    <div className="mt-[20px] custom-articles-list">
      <Delete show={showDel} setShow={setShowDel} id={id} />
      <List
        dataSource={articles}
        loading={loading}
        rowKey={(article) => article?.id}
        renderItem={(item) => (
          <List.Item>
            <ArticleCard
              onView={() =>
                navigate(
                  `/admin/dashboard/knowledge-base/articles/view/${item?.id}`
                )
              }
              onEdit={() =>
                navigate(
                  `/admin/dashboard/knowledge-base/articles/edit/${item?.id}`
                )
              }
              onDelete={() => {
                setId(item?.id);
                setShowDel(true);
              }}
              {...item}
              articleType="Draft"
            />
          </List.Item>
        )}
      />
    </div>
  );
}
