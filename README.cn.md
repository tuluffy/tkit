# TKit

typescript react app 脚手架

## CONFIG

```
  # webpack public path 配置，见 package.json:
  homepage: "",
  # webpack proxy 配置，见 package.json:
  proxy: {}
```

## REQUIREMENTS

_请勿使用 cnpm!!不然会使得 npm-shrinkwrap.json 版本锁定文件不生效_

```
  + VScode 需安装 tslint、stylelint 插件，使用 visual studio code，可以享受到完善的 autocomplete
  + node v8.9.0+
  + npm 5.5.1+
```

## CLONE

```shell
  git clone # 当前仓库当前分支
```

## START

```shell
  npm install # !! 不要使用 cnpm i !! cnpm 可能会导致 npm-shrinkwrap.json 版本锁定失效
  npm start themeName # 本地测试， yellow - 使用经典橘黄色； 否则，是蓝色
  npm test # 执行测试
  npm run build themeName  # 构建发布到 build 目录， yellow - 使用经典橘黄色；否则，是蓝色
```

## 工具

### swagger2service

```shell
  sh scripts/gen-service.sh 后端swagger.api.json地址
```

### Tkit

#### 创建 model

命名遵循驼峰格式: xxModel

state 定义的数据结构会直接 merge 到全局 store 的 [feature]下，注意多个 model 之间名字可能会产生冲突，最好使用层级关系

namespace 会以 `${namespace}/actionName` 自动注入到 dispatch 的 action 中，如果要触发本 model 或者其他 model 的 action:

本 model:

```tsx
  *doSomethingAsync({ namespace, put }, action: Tction<{ username: string }>) {
    yield put({ type: `${namespace}/doLogin`, payload: { username: '' } });
  }
```

其他 Model:

```tsx
  import otherModel from './xxx';

  *doSomethingAsync({ namespace, put }, action: Tction<{ username: string }>) {
    yield put({ type: otherModel.TYPES.actionsNameA, payload: { username: '' } });
  }
```

````shell
  ./scripts/kit.js add model feature/xxModel

```ts
import createModel, { Tction } from '@src/utils/createModel';

export default createModel({
  state: {
    username: ''
  },
  namespace: 'userInfo',
  reducers: {
    // @params.0 state
    // @params.0 action
    // doSomething: (state, action: Tction<{ username: string }>) => {
    //   return {
    //     ...state,
    //     username: action.payload.username
    //   };
    // }
  },
  effects: {
    // @params.0 sagaEffect
    // @params.0 action
    // *doSomethingAsync({ namespace, put }, action: Tction<{ username: string }>) {
    //   yield put({ type: `${namespace}/doLogin`, payload: { username: '' } });
    // }
  }
});

````

#### 创建 action

命名遵循驼峰格式: 动词 + 名词，例如 login，pullUserInfo

实际生成: doLogin, loginReducer

```shell
  ./scripts/kit.js add action feature/actionName
```

#### 创建 异步 action

命名遵循驼峰格式: 动词 + 名词，例如 login，pullUserInfo

实际生成 action: doLogin, loginReducer, sagaLogin【暂定，可能会校正为一系列 watchLogin 】

```shell
  ./scripts/kit.js add action feature/sagaName -a
```

##### tPull, tCall

原生的 redux-saga put & call 对 effect 的调用是 untyped，因此在 createModel.ts 内封装了 typed tPut & tCall

```tsx
  tCall(effect, args: typed) - args 类型必须是 effect 定义的参数类型
  // 对于通过 redux-actions createAction 创建的 actions【通过 toString = () => action.name 】:
  tPut(action, args: typed) - args 类型必须是 action 定义的参数类型
```

#### 创建适配 antd 分页 list action

命名请: xxxList - 用以表示分页

```shell
  # 命令请使用 xxxList 结构
  ./scripts/kit.js add list feature/xxxList
```

对应 store、actions

```tsx
  // 往指定 feature 下写入 xxxList 数据结构
  {
    [featureName]: {
      [xxxList]: {
        pageData: [],
        total: 0,
        params: {
          current: 1,
          pageNum: 1,
          pageSize: 10,
          ...params
        },
        rowKey: 'id', // 默认是 id
        selectedRowKeys: [], // 当前选中的行的 rowKeys
        loading: true, // 是否正在加载
        isfetch: true, // 是否正在加载，同 loading
        fetchError: false // 错误信息
      }
    }
  }

  // 往 actions 内写入
  {
    // 拉取翻页数据
    doTestList: (params: Home.ListParams) => xxx
    // 选中行，适配 antd
    doSelectTestList: (payload: {
      // 设置选中
      selectedRowKeys?: IPagenationState['selectedRowKeys'];
      // 指定新的 rowKey
      rowKey?: string | number;
    }) => xxx
  }
```

#### 创建 Component

用以创建容器组件以及具有 state 的组件

命名遵循驼峰格式，不能使用 default, index

```shell
./scripts/kit.js add component feature//componentName // 非页面组件，会放在 feature/components/ 目录里
./scripts/kit.js add component feature/componentName // 页面组件
-c : connect redux store
-u : 路由页面，存在 this.props.match.params，组件名请使用 XXXPage
-p : pureComponent，创建PureComponent

-f : 慎用，覆盖已有
```

#### 创建 Presenter 无状态组件

命名遵循驼峰格式，不能使用 default, index

```shell
./scripts/kit.js add presenter feature//componentName // 非页面组件，会放在 feature/components/ 目录里
./scripts/kit.js add presenter feature/presenterName // 页面级别
-c : connect redux store
-u : 路由页面，存在 props.match.params，组件名请使用 XXXPage
```
