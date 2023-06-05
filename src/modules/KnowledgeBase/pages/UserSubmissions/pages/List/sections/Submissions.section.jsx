import { List } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArticleCardSub } from 'components';
import { Delete } from 'modules/KnowledgeBase/pages/Articles/pages/List/sections'; 
import { useState } from 'react';

export function Submissions({ articles, handleApprove, handleGenerateTicket }) {
  const [showDel, setShowDel] = useState(false);
  const [id, setId] = useState('');
  const navigate = useNavigate();

  return (
    <div className="mt-[20px]">
      {<Delete show={showDel} setShow={setShowDel} id={id} />}
      <List
        grid={{ gutter: 16, column: 3,lg: 2, md: 2, sm: 1, xs: 1 }}
        dataSource={articles}
        rowKey={(article) => article?.id}
        renderItem={(item) => (
          <List.Item>
            <ArticleCardSub
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
              onApprove={() => handleApprove(item?.id)}
              onGenerateTicket={() => handleGenerateTicket(item?.id, item?.createdBy)}
              {...item}
              articleType="Submitted For Review"
            />
          </List.Item>
        )}
      />
    </div>
  );
}
