# Web Client JS

[Web Client Js](https://github.com/adaluocn/web-client-js) Client-side JavaScript exception and tracing library.

- Provide metrics and error collection to Web backend.
- Lightweight
- Make browser as a start of whole distributed tracing

# Usage

## Install

The `web-client-js` runtime library is available at [npm](https://www.npmjs.com/package/web-client-js).

```
npm install web-client-js --save
```

## Quick Start

User could use `register` method to load and report data automatically.

```js
import ClientMonitor from 'web-client-js';
```

```js
// Report collected data to `http:// + window.location.host + /browser/perfData` in default
ClientMonitor.register({
  collector: 'http://127.0.0.1:12800',
  service: 'test-ui',
  pagePath: '/current/page/name',
  serviceVersion: 'v1.0.0',
});
```

### Parameters

The register method supports the following parameters.

| Parameter         | Type                 | Description                                                                                                                                                                                                                                                                                                                                                                                     | Required | Default Value |
| ----------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- |
| collector         | String               | In default, the collected data would be reported to current domain(`/browser/perfData`. Then, typically, we recommend you use a Gateway/proxy to redirect the data to the OAP(`resthost:restport`). If you set this, the data could be reported to another domain, NOTE [the Cross-Origin Resource Sharing (CORS) issuse and solution](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). | false    | -             |
| service           | String               | project ID.                                                                                                                                                                                                                                                                                                                                                                                     | true     | -             |
| serviceVersion    | String               | project verison                                                                                                                                                                                                                                                                                                                                                                                 | true     | -             |
| pagePath          | String               | project path                                                                                                                                                                                                                                                                                                                                                                                    | true     | -             |
| jsErrors          | Boolean              | Support js errors monitoring                                                                                                                                                                                                                                                                                                                                                                    | false    | true          |
| apiErrors         | Boolean              | Support API errors monitoring                                                                                                                                                                                                                                                                                                                                                                   | false    | true          |
| resourceErrors    | Boolean              | Support resource errors monitoring                                                                                                                                                                                                                                                                                                                                                              | false    | true          |
| useFmp            | Boolean              | Collect FMP (first meaningful paint) data of the first screen                                                                                                                                                                                                                                                                                                                                   | false    | false         |
| enableSPA         | Boolean              | Monitor the page hashchange event and report PV, which is suitable for single page application scenarios                                                                                                                                                                                                                                                                                        | false    | false         |
| autoTracePerf     | Boolean              | Support sending of performance data automatically.                                                                                                                                                                                                                                                                                                                                              | false    | true          |
| vue               | Vue                  | Support vue errors monitoring                                                                                                                                                                                                                                                                                                                                                                   | false    | undefined     |
| traceSDKInternal  | Boolean              | Support tracing SDK internal RPC.                                                                                                                                                                                                                                                                                                                                                               | false    | false         |
| detailMode        | Boolean              | Support tracing http method and url as tags in spans.                                                                                                                                                                                                                                                                                                                                           | false    | true          |
| noTraceOrigins    | (string \| RegExp)[] | Origin in the `noTraceOrigins` list will not be traced.                                                                                                                                                                                                                                                                                                                                         | false    | []            |
| traceTimeInterval | Number               | Support setting time interval to report segments.                                                                                                                                                                                                                                                                                                                                               | false    | 60000         |

## Collect Metrics Manually

Use the `setPerformance` method to report metrics at the moment of page loaded or any other moment meaningful.

1. Set the SDK configuration item autoTracePerf to false to turn off automatic reporting performance metrics and wait for manual triggering of escalation.
2. Call `ClientMonitor.setPerformance(object)` method to report

- Examples

```js
import ClientMonitor from 'web-client-js';

ClientMonitor.setPerformance({
  collector: 'http://127.0.0.1:12800',
  service: 'browser-app',
  serviceVersion: '1.0.0',
  pagePath: location.href,
  useFmp: true,
});
```

## Special scene

### SPA Page

In spa (single page application) single page application, the page will be refreshed only once. The traditional method only reports PV once after the page loading, but cannot count the PV of each sub-page, and can't make other types of logs aggregate by sub-page.  
The SDK provides two processing methods for spa pages:

1. Enable spa automatic parsing  
   This method is suitable for most single page application scenarios with URL hash as the route.  
   In the initialized configuration item, set enableSPA to true, which will turn on the page's hashchange event listening (trigger re reporting PV), and use URL hash as the page field in other data reporting.
2. Manual reporting  
   This method can be used in all single page application scenarios. This method can be used if the first method is invalid.  
   The SDK provides a set page method to manually update the page name when data is reported. When this method is called, the page PV will be re reported by default. For details, see setPerformance().

```js
app.on('routeChange', function (next) {
  ClientMonitor.setPerformance({
    collector: 'http://127.0.0.1:12800',
    service: 'browser-app',
    serviceVersion: '1.0.0',
    pagePath: location.href,
    useFmp: true,
  });
});
```

## Tracing range of data requests in the browser

Support tracking these([XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)) two modes of data requests. At the same time, Support tracking libraries and tools that base on XMLHttpRequest and fetch, such as [Axios](https://github.com/axios/axios), [SuperAgent](https://github.com/visionmedia/superagent), [OpenApi](https://www.openapis.org/) and so on.

## Catching errors in frames, including React, Angular, Vue.

```js
// Angular
import { ErrorHandler } from '@angular/core';
import ClientMonitor from 'web-client-js';
export class AppGlobalErrorhandler implements ErrorHandler {
  handleError(error) {
    ClientMonitor.reportFrameErrors({
      collector: 'http://127.0.0.1:12800',
      service: 'angular-demo',
      pagePath: '/app',
      serviceVersion: 'v1.0.0',
    }, error);
  }
}
@NgModule({
  ...
  providers: [{provide: ErrorHandler, useClass: AppGlobalErrorhandler}]
})
class AppModule {}
```

```js
// React
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    ClientMonitor.reportFrameErrors(
      {
        collector: 'http://127.0.0.1:12800',
        service: 'react-demo',
        pagePath: '/app',
        serviceVersion: 'v1.0.0',
      },
      error,
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>;
```

```js
// Vue
Vue.config.errorHandler = (error) => {
  ClientMonitor.reportFrameErrors(
    {
      collector: 'http://127.0.0.1:12800',
      service: 'vue-demo',
      pagePath: '/app',
      serviceVersion: 'v1.0.0',
    },
    error,
  );
};
```

### 客户端网关服务器配置

```config
server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       8081;   #监听端口
        server_name  127.0.0.1;   #监听地址
        location  / {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
            root /Users/chenfei/study/vue01/dist/;  # 这个路径是存放打包后的 前端项目dist的路径
            index index.html;         # 访问入口文件
        }
     # 切记， 在docker启动的nginx 必须将该文件中所有的 localhost 改成服务器的 内网ip （不能为 127.0.0.1）
           location /browser {
               proxy_set_header   Host $host:$server_port;
               proxy_redirect off;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_connect_timeout 60;
               proxy_read_timeout 600;
               proxy_send_timeout 600;
               proxy_pass http://127.0.0.1:12800/browser;
           }

 }
```
