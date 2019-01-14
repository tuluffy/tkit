import moment from 'moment';
import { i18n } from '@src/utils/i18n';

const defaultFormat = 'YYYY-MM-DD';
const today = moment().format(defaultFormat);
export const baseFormat = (format: string = defaultFormat) => {
  return <S>(stamp: S) => {
    if (typeof stamp === 'string') {
      const current = moment(stamp).format(format);
      return current === today ? (i18n('common.today', '今日') as string) : current;
    }
    return '';
  };
};

export const formatTime = baseFormat();
export const formatYDotM = baseFormat('YYYY.MM');
export const formatHm = baseFormat('H:mm');
export const formatFull = baseFormat('YYYY-MM-DD HH:mm:ss');
