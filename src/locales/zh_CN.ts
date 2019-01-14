import antd from 'antd/lib/locale-provider/zh_CN';
import * as lang from 'react-intl/locale-data/zh';
import home from './home/home_zh';

declare global {
  var LocalDataMessages: Root.LocalDataMessages;
}
// @ts-ignore
global.LocalDataMessages = {
  messages: {
    ...home,
    validator: {
      required: '必填',
      string: {
        len: '%s长度必须 %s 字符',
        max: '%s长度不超过 %s 字符',
        min: '%s长度不少于 %s 字符',
        range: '%s长度需介于 %s - %s 字符'
      },
      singleChar: '只允许输入单字符',
      alphabet: '只允许输入大小写字母',
      minLength: '长度必须大于等于{min}',
      maxLength: '长度必须小于等于{max}',
      length: '长度必须等于{length}',
      array: '必须是数组',
      min: '必须大于{min}',
      max: '必须小于{max}',
      decimal: '必须精确到{decimal}位小数点',
      integer: '必须是整数',
      pattern: '请输入正确的{label}',
      email: '请输入正确的邮箱',
      url: '请输入正确的链接,http:// 或 https:// 开头',
      phone: '请输入正确的手机格式',
      tel: '请输入正确的电话格式',
      date: '请输入正确的日期',
      datetime: '请输入正确的时间',
      enum: '必须是{enum}之一',
      types: {
        array: '%s必须是数组',
        boolean: '%s必须是boolean',
        date: '%s必须是日期',
        email: '%s必须是邮箱',
        float: '%s必须是浮点数',
        hex: '%s必须是hex',
        integer: '%s必须是整数',
        method: '%s必须是函数',
        number: '%s必须是数字',
        object: '%s必须是对象',
        regexp: '%s必须是正则',
        // string: "%s必须是字符串",
        url: '%s必须是url'
      },
      number: {
        len: '%s位数必须等于%s',
        min: '%s必须大于%s',
        max: '%s必须小于%s',
        range: '%s必须大于%s且必须小于%s'
      }
    }
  },
  antd,
  lang,
  locale: 'zh'
};
