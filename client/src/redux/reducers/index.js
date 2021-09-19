import { combineReducers } from 'redux';
import auth from './auth';
import images from './images';
import ui from './ui';
import search from './search';

export default combineReducers({ auth, images, ui, search });
