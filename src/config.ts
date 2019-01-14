// 公用业务组件配置
export default {
  // 员工列表接口: 支持 { name: xx } 模糊检索
  USER_LIST_API: '/recruit/api/v1/persons',

  // 要求返回数据格式必须符合 ./common.d.ts 内约定
  USER_INFO_API: '/recruit/api/v1/user/info',

  // 文件上传服务器
  UPLOAD_API: '/recruit/api/v1/common/upload',

  // 文件下载 API
  DOWND_API: '/recruit/api/v1/common/download'
};
