import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import {
  Drafts,
  Navigation,
  PrivateArticles,
  PublicArticles,
} from './sections';

const navData = [
  { label: 'Public Articles', path: 'public-articles' },
  { label: 'Private Articles', path: 'private-articles' },
  { label: 'Drafts', path: 'drafts' },
];

// const data = [];
// for (let i = 0; i <= 20; i++) {
//   data.push({
//     id: `3fa85f64-5717-4562-b3fc-2c963f66afa6${i}`,
//     title: `Article Title ${i}`,
//     bodyText: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`,
//     imagePath: `/article.jpg`,
//     visibility: true,
//     articleStatus: 'string',
//     articleCategories: [
//       {
//         categoryId: `3fa85f64-5717-4562-b3fc-2c963f66afa6${i}`,
//         category: {
//           id: `3fa85f64-5717-4562-b3fc-2c963f66afa6${i}`,
//           name: 'ARTICLE CATEGORY',
//           description: 'string',
//           parentCategoryId: `3fa85f64-5717-4562-b3fc-2c963f66afa6${i}`,
//           categoryType: '0 = ProductServices',
//         },
//       },
//     ],
//   });
// }

export const List = () => {
  const [current, setCurrent] = useState('public-articles');

  const getCurrentScreen = () => {
    switch (current) {
      case 'public-articles':
        return <PublicArticles />;
      case 'private-articles':
        return <PrivateArticles />;
      case 'drafts':
        return <Drafts />;
      default:
        return <PublicArticles />;
    }
  };

  return (
    <div className="p-[40px]">
      {/* Navigation */}
      <Navigation current={current} setCurrent={setCurrent} navData={navData} />
      {/* Current Active Screen */}
      {getCurrentScreen()}
    </div>
  );
};
