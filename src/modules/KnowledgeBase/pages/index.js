import Articles from './Articles/Articles.page';
import UserSubmissions from './UserSubmissions/UserSubmissions.page';
import Feedback from './Feedback/Feedback.page';
import Categories from './Categories/Categories.page';
import Overview from './Overview/Overview.page';

export const pages = [
  { path: '/articles/*', Component: Articles },
  { path: '/user-submissions/*', Component: UserSubmissions },
  { path: '/feedback/*', Component: Feedback },
  { path: '/categories/*', Component: Categories },
  { path: '/overview/*', Component: Overview },
];
