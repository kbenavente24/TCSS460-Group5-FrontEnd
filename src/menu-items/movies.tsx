// third-party
import { FormattedMessage } from 'react-intl';

// assets
import VideoCameraOutlined from '@ant-design/icons/VideoCameraOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  VideoCameraOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined
};

// ==============================|| MENU ITEMS - MOVIES ||============================== //

const movies: NavItemType = {
  id: 'movies-group',
  title: 'Movies & TV',
  type: 'group',
  children: [
    {
      id: 'movies',
      title: 'Browse Movies',
      type: 'item',
      url: '/movies',
      icon: icons.VideoCameraOutlined
    },
    {
      id: 'add-movie',
      title: 'Add Movie',
      type: 'item',
      url: '/add-movie',
      icon: icons.PlusCircleOutlined
    },
    {
      id: 'top10',
      title: 'Top 10 Lists',
      type: 'item',
      url: '/top10',
      icon: icons.UnorderedListOutlined
    }
  ]
};

export default movies;
