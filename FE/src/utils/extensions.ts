import _, { LoDashStatic } from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import { v4 } from 'uuid';

declare global {
    interface Window {
        _: LoDashStatic;
        moment: {};
        v4: {};
        numeral: any;
        getDaysInMonth: (currentMoment?: moment.MomentInput) => moment.Moment[];
        clients: any;
        appInfo: {
            version: string;
        };
        currentDate: Date;
        json2UrlSearch: (jsonData: any) => URLSearchParams;
        clearNullField: (obj: any) => any;
        niceBytes: (value) => any;
        invertColor: (hex, bw?) => any;
        stream: any;
        niceNumber: (value) => any;
    }
}
numeral.defaultFormat('0,0.[00]');

window.appInfo = {
    version: '1.0.0'
};

window.currentDate = new Date();
window._ = _;
window.numeral = numeral;

window.moment = moment;
window.v4 = v4;
window.getDaysInMonth = (currentMoment?: moment.MomentInput) => {
    const daysInMonth: moment.Moment[] = [];
    const monthDate = moment(currentMoment).startOf('month');

    for (let i = 0; i < monthDate.daysInMonth(); i + 1) {
        const newDay = monthDate.clone().add(i, 'days');
        daysInMonth.push(newDay);
    }

    return daysInMonth;
};

window.json2UrlSearch = (jsonData: any) => {
    const params = new URLSearchParams();
    for (const key in jsonData) {
        if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
            params.append(key, jsonData[key]);
        }
    }
    return params;
};

window.clearNullField = (obj: any) => {
    return _(obj)
        .omitBy(_.isUndefined)
        .omitBy(_.isNull)
        .omitBy((s) => _.isEqual(s, ''))
        .value();
};

window.niceBytes = (x) => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0,
        n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
        n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
};

window.invertColor = (hex, bw = true) => {
    if (!hex) {
        return '#464646';
    }

    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        return hex;
    }
    let r: any = parseInt(hex.slice(0, 2), 16),
        g: any = parseInt(hex.slice(2, 4), 16),
        b: any = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#464646' : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return '#' + r.padStart(2, '0') + g.padStart(2, '0') + b.padStart(2, '0');
};

window.niceNumber = (value: number) => {
    // Nine Zeroes for Billions
    return Math.abs(Number(value)) >= 1.0e9
        ? Math.abs(Number(value)) / 1.0e9 + 'B'
        : // Six Zeroes for Millions
        Math.abs(Number(value)) >= 1.0e6
        ? Math.abs(Number(value)) / 1.0e6 + 'M'
        : // Three Zeroes for Thousands
        Math.abs(Number(value)) >= 1.0e3
        ? Math.abs(Number(value)) / 1.0e3 + 'K'
        : Math.abs(Number(value));
};
