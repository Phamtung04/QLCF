// theme constant
import Data from 'assets/currencies.json';

import * as _ from 'lodash';

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
