### 自动转换 Swagger 到 service

#### 转换

```
  scripts/gen-service.sh swagger文件 # 可支持 url 及本地文件
```

转换后代码在:

```
  src/service
```

使用:

```
  import * as service from '@src/services/';

  # $开头的方法都是私有属性
  service.APIS.所属模块.方法名
```

新 doAsync\* 使用[打通 service 参数校验]:

```
  this.props.actions.doNewAsync(service.APIS.DefaultApi.addBusinessProcessUsingPOST, {
    params: {
      data: {
        name: '2'
      }
    }
  });
  this.props.actions.doNewAsyncConfirmed(service.APIS.OfferApi.batchSendOfferUsingPOST, {
    params: {
      data: {
        applyIds: [ 1 ]
      }
    }
  });
```

#### 转换后 api 格式

为方便编码，所有自动转换后的接口一律为:

```
  api: ({
    // 添加到请求 headers 内参数
    header: { ... },
    // path 内参数
    path: { ... },
    // url search
    query: ...,
    // post json
    data: ...,
    // post form 表单
    form: {
      file: { ... }
    },
    // 所有 fetch 的扩展字段、参数
    extra: { ... }
  })
```
