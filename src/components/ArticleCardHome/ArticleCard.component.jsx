import './ArticleCard.styles.scss';

export const ArticleCard = ({
  title,
  onView,
  green,
}) => {
  return (
    <div onClick={onView} className="p-[10px] flex flex-row gap-[10px] custom-article-card2 rounded-[8px]">
    <div className={green?"docx":"docx-l"}>
      <div className={green?'imgx-p':'imgx-l'}>
      </div>
      </div>
      <div className='title-article'>
        {title}
      </div>
    </div>
  );
};
