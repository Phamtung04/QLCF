// theme constant
import Data from 'assets/currencies.json';
import CountryData from 'assets/countries.json';
import ClassicActive from 'assets/images/Classic-active.png';
import Classic from 'assets/images/Classic.png';
import DiamondActive from 'assets/images/Diamond-active.png';
import Diamond from 'assets/images/Diamond.png';
import EmeraldActive from 'assets/images/Emerald-active.png';
import Emerald from 'assets/images/Emerald.png';
import RubyActive from 'assets/images/Ruby-active.png';
import Ruby from 'assets/images/Ruby.png';
import SapphireActive from 'assets/images/Sapphire-active.png';
import Sapphire from 'assets/images/Sapphire.png';
import * as _ from 'lodash';
import { get } from 'lodash';

export const gridSpacing = 2;
export const drawerWidth = 260;
export const drawerMiniWidth = 120;
export const appDrawerWidth = 320;
export const minYear = 2022;

export const lowColor = '#8ec320';
export const mediumColor = '#ffc20e';
export const dangerColor = '#eb2629';

export const currencyTypes = _.chain(Data)
    .map((item, key) => ({
        id: key,
        name: key + ' - ' + item
    }))
    .toArray()
    .value();
