// project import
import samplePage from './sample-page';
import movies from './movies';
import other from './other';
// import pages from './messages'; // Removed - messages not needed

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [samplePage, movies, other],
};

export default menuItems;
