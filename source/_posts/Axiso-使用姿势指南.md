---
title: Axiso 使用姿势指南
comments: true
date: 2018-09-19 22:09:48
tags:
from:
---

最近几个项目都用到了 Axios，它是一个更现代的 API 请求库，基于 Promise，能运行在浏览器和 Node.js 里。在项目里，一般都是需要进行一次封装再来使用，比如处理鉴权、还有全局的请求 Loading 动画等。今天来总结一下。

<!-- more -->

### Axios 简介

[Axios](https://github.com/axios/axios) 是一个基于 Promise 用于浏览器和 nodejs 的 HTTP 客户端。它有以下功能：

- 从浏览器中创建 XMLHttpRequest
- 从 Node.js 发出 HTTP 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 自动转换 JSON 数据
- 客户端防止 CSRF/XSRF

### 基础 API

- `axios.request(config)`
- `axios.get(url [,config])`
- `axios.delete(url [,config])`
- `axios.head(url [,config])`
- `axios.options(url [,config])`
- `axios.post(url [,data [,config]])`
- `axios.put(url [,data [,config]])`
- `axios.patch(url [,data [,config]])`

<div class="tip">
  HTTP 请求方法一般会按照它具体的含义来执行相关的动作，这里有一份 [HTTP 动词对应解释 @MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)。
</div>

### 用法示例

#### GET

```js
// 向具有指定 ID 的用户发出请求（参数在 URL 上）
axios
  .get('/user?ID=12345')
  .then(function(res) {
    console.log(res);
  })
  .catch(function(error) {
    console.log(error);
  });

// 也可以通过 params 对象传递参数
axios
  .get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```

#### POST

```js
axios
  .post(
    '/user',
    {
      userId: '123'
    },
    {
      headers: {
        token: 'abc'
      }
    }
  )
  .then(function(res) {
    console.log(res);
  })
  .catch(function(error) {
    console.log(error);
  });
```

#### 直接使用 config

```js
// GET
axios({
  url: 'pakage.json',
  method: 'get',
  params: {
    // get 在 params 中定义
    userId: '123'
  },
  headers: {
    token: 'http-test'
  }
}).then(res => {
  console.log(res.data);
});

// POST
axios({
  url: 'pakage.json',
  method: 'post',
  data: {
    // post 在 data 中定义
    userId: '123'
  },
  headers: {
    token: 'http-test'
  }
}).then(res => {
  console.log(res.data);
});
```

#### 并发请求

```js
function getUserAcount() {
  // 返回一个 promise 对象
  return axios.get('/user/1234');
}
function getUserPermissions() {
  // 返回一个 promise 对象
  return axios.get('/user/1234/getUserPermissions');
}

// 一次性返回两个接口
axios.all([getUserAccount(), getUserPerssions()]).then(
  axios.spread((acct, perms) => {
    // spread 展开两个返回的结果
    // 两个请求现已完成
  })
);
```

### 全局封装、异常处理

在项目中，如果每次请求都写一堆 `config` 会存在大量重复代码，一般我们会封装成一个方法，把一些必要的参数配置好，同理，全局的异常还有鉴权等都统一配置。单此请求数据只做和数据相关的业务逻辑。下面来看一下 Axios 的全局封装例子。

#### 封装

```js
import axios from 'axios';
import qs from 'qs';

// POST 方法封装  (原生 form 提交)
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: url,
    data: params,
    transformRequest: [
      function(data) {
        return qs.stringify(data);
      }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

// POST 方法封装  (文件上传)
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

//  GET 方法封装
export const getRequest = url => {
  return axios({
    method: 'get',
    url: url
  });
};

//  PUT 方法封装
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: url,
    data: params,
    transformRequest: [
      function(data) {
        return qs.stringify(data);
      }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

//  DELETE 方法封装
export const deleteRequest = url => {
  return axios({
    method: 'delete',
    url: url
  });
};
```

#### 异常处理

```js
import axios from 'axios';
import { Message } from 'element-ui';

//  请求拦截
axios.interceptors.request.use(
  config => {
    // 请求前配置 config
    return config;
  },
  err => {
    // 错误处理
    Message.error({ message: '请求超时!' });
    return Promise.resolve(err);
  }
);

// 响应拦截
axios.interceptors.response.use(
  data => {
    // 请求后处理对应的数据

    // 方式一：和后端约定响应码 `code`
    switch (data.code) {
      case '0':
        // 正常直接返回
        return data;
      // 需要重新登录
      case '-1':
        // some code here..
        break;
      default:
    }

    // 方式二：仅判断 HTTP 状态码
    if (data.status && data.status == 200 && data.data.status == 'error') {
      Message.error({ message: data.data.msg });
      return;
    }
    return data;
  },
  err => {
    // 错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误 (400)';
          break;
        case 401:
          err.message = '未授权，请重新登录 (401)';
          break;
        case 403:
          err.message = '拒绝访问 (403)';
          break;
        case 404:
          err.message = '请求出错 (404)';
          break;
        case 408:
          err.message = '请求超时 (408)';
          break;
        case 500:
          err.message = '服务器错误 (500)';
          break;
        case 501:
          err.message = '服务未实现 (501)';
          break;
        case 502:
          err.message = '网络错误 (502)';
          break;
        case 503:
          err.message = '服务不可用 (503)';
          break;
        case 504:
          err.message = '网络超时 (504)';
          break;
        case 505:
          err.message = 'HTTP 版本不受支持 (505)';
          break;
        default:
          err.message = `连接出错 (${err.response.status})!`;
      }
    } else {
      err.message = '连接服务器失败!';
    }
    Message.err({ message: err.message });
    return Promise.resolve(err);
  }
);
```

<div class="tip">
请求出错的时候执行的是：`Promise.resolve(err)`，而不是 `Promise.reject(err)`，这样无论请求成功还是失败，在成功的回调中都能收到通知。
</div>

### 其它配置

#### baseURL

通过 `axios.defaults.baseURL` 来设置 API 的根域名。

```js
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'https://dev.server.com/';
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = 'https://debug.server.com/';
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'https://pro.server.com/';
}
```

<div class="tip">
`process.env` 是 Node.js 提供的全局变量，我们可以在 npm scripts 里通过 cross-env 这个工具统一配置不同的环境，cross-env 做了各种系统平台的兼容处理。一般用这个设置环境变量。
</div>

#### 请求超时

通过 `axios.defaults.timeout` 设置默认的请求超时时间。例如超过了 10s，就会告知用户当前请求超时，请刷新等。

```js
axios.defaults.timeout = 10000;
```

#### 单独设置 POST 的请求头

比如设置 POST 提交（原生 form）时单独配置。

```js
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';
```

### 附: 完整代码

```js
import axios from 'axios';
import QS from 'qs';
import {Toast} from 'vant';

// 环境的切换
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'https://dev.server.com/';
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = 'https://debug.server.com/';
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'https://pro.server.com/';
}

// 请求超时时间
axios.defaults.timeout = 10000;

// POST 请求头
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
  config = > {
    const token = store.state.token;
    token && (config.headers.Authorization = token);
    return config;
  }, error = > {
    return Promise.error(error);
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response = > {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是 200 的情况
  error = > {
    if (error.response.status) {
      switch (error.response.status) {
      case 401:
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        });
        break;
      case 403:
        Toast({
          message: '登录过期，请重新登录',
          duration: 1000,
          forbidClick: true
        });
        break;
        // 404 请求不存在
      case 404:
        Toast({
          message: '网络请求不存在',
          duration: 1500,
          forbidClick: true
        });
        break;
        // 其他错误，直接抛出错误提示
      default:
        Toast({
          message: error.response.data.message,
          duration: 1500,
          forbidClick: true
        });
      }
      return Promise.reject(error.response);
    }
  }
);

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params })
      .then(res => {
        resolve(res.data);
      })
      .catch (err => {
        reject(err.data)
      })
  });
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, QS.stringify(params))
      .then(res = > {
        resolve(res.data);
      })
      .catch (err => {
        reject(err.data)
      })
  });
}
```

### 附: Content-Type

说到和服务端数据交互，总是绕不开这个，必须要扫盲一下了！😂😂

> Content-Type 用于指定内容类型，一般是指网页中存在的 Content-Type，Content-Type 属性指定请求和响应的 HTTP 内容类型。如果未指定 ContentType，默认为 `text/html`。

常见类型有：

- text/html
- application/x-www-form-urlencoded
- multipart/form-data
- application/json
- application/xml

`application/x-www-form-urlencoded`、`multipart/form-data`、`application/json`、`application/xml` 这四个则是 ajax 请求需要指定的类型，表单提交或上传文件常用的资源类型。

#### application/x-www-form-urlencoded

这是表单默认提交方式，格式为 URL 编码 `key=value&key1=value1`。

<div style="max-width: 500px">![image](https://user-images.githubusercontent.com/9158841/32037816-ade83a36-b9ec-11e7-9f07-4f72a99c6aaa.png)</div>

注：Chrome 浏览器会自动格式化成易读的格式

#### multipart/form-data

使用表单上传文件时，必须指定表单的 enctype 属性值为 `multipart/form-data`。
请求体被分割成多部分，每部分使用 `--boundary` 分割，使用 `--boundary--\r\n` 结束。

表单上传文件 Demo:

```html
<form action="/upload" enctype="multipart/form-data" method="post">
    用户名: <input type="text" name="username">
    密码: <input type="password" name="password">
    上传文件: <input type="file" name="file">
    <input type="submit" value="提交">
</form>
```

<div style="max-width: 500px">![image](https://user-images.githubusercontent.com/9158841/32038354-1201f94c-b9ef-11e7-8817-fb9031b2b036.png)</div>

#### application/json

Axios 默认 `POST` 提交方式就是 `application/json`，所以，在使用 axios 提交表单时需要注意后端能不能解析，不能解析需要设置 `POST` 常用格式 `application/x-www-form-urlencoded`，且提交的数据需要使用 qs 模块序列化格式。

```js
axios.post(
  'https://jsonplaceholder.typicode.com/posts',
  {
    userId: 1,
    name: 'ifyour',
    arr: [1, 2, 3, 4]
  },
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
      function(data) {
        return qs.stringify(data);
      }
    ]
  }
);
```

<div style="max-width: 400px">![image](https://user-images.githubusercontent.com/15377484/45913317-a939a580-be62-11e8-9d96-1a097337da44.png)</div>

#### application/xml

```text
POST http://www.example.com HTTP/1.1
Content-Type: text/xml
```

```xml
<?xml version="1.0"?>
<resource>
    <id>123</id>
    <params>
        <name>
            <value>example</value>
        </name>
        <age>
            <value>21</value>
        </age>
    </params>
</resource>
```

### 参考

- [Axios 官方文档 @GitHub](https://github.com/axios/axios#installing)
- [HTTP Content-Type 对照表 @OSChina](http://tool.oschina.net/commons)
- [HTTP 请求方法 @MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)
