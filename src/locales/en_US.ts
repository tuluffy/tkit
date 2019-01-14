import antd from 'antd/lib/locale-provider/en_US';
import * as lang from 'react-intl/locale-data/en';
import home from './home/home_en';

declare global {
  var LocalDataMessages: Root.LocalDataMessages;
}
// @ts-ignore
global.LocalDataMessages = {
  messages: {
    ...home
  },
  antd,
  lang,
  locale: 'en'
};
