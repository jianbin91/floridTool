## 如何快速的撸出一个官网

### 说明
* 该代码库是以下内容的自动化工具
* 操作方式: sh 1_unzip.sh; sh 2_editHome.sh; sh 3_buid_upload.sh;


### 开始：
* 预估时间 1 天（包括优化和写脚本时间）
* 需要的角色
	* 一个开发 （构建、部署；需要熟悉前后端）；占比80%；
	* 一个设计（主要设计logo、宣传图）；占比10%；
	* 产品（可以开发兼任，主要是根据landing.ant.design选型一下）；占比10%；
* 借助的工具和框架
	* https://landing.ant.design/index-cn (可视化设计页面，导出的是react源码)；
	* https://umijs.org/zh/guide/ (可视化设计好后，通过该框架来渲染)
	* 七牛云存储；


### 第一阶段;可视化设计
* 参考 landing.ant.design 说明文档；设计完后导出react源码组件；
* 设计师设计的素材；可以通过上传到七牛；获取到图片链接后，在引用到可视化设计里面；

### 第二阶段：使用umi来渲染react代码
* 以下是参考自： https://landing.ant.design/docs/use/umi-cn

```
mkdir tavel;
cd tavel;
mkdir src
umi g page index;
unzip Home.zip
mv Home ./src
mv pages ./src
yarn add react react-dom
yarn add umi-plugin-react
```

```
vim .umirc.js 
// .umirc.js 
export default {
  plugins: [
    [
      'umi-plugin-react', {
        antd: true,
      }
    ],
  ]
}
```

```
vim src/pages/index.js
// index.js 
import Home from '../Home';
	export default function() {
	  return (
	
	   <Home />
	  );
	}
```

```
vim src/global.less
//global.less
@import './Home/less/antMotionStyle.less';
```

```
vim src/Home/index.jsx
删除该句： import './less/antMotionStyle.less';
```

* 执行完后：umi dev，进行调试；如有报错 提示有依赖组件 is not install 则使用  yarn add ’组件名称‘ 安装一下；
* 最后进行 umi build; 在dist目录里面就能看到你要发布的内容

### 第三阶段（属于优化，可选操作）：js上传到cdn；加快页面加载速度；
* 编译完后因为 umi.js 太大；超过了1M；且是放在根目录下；如果你站点没加cdn；会导致首次访问比较慢；所以建议你把umi.js 上传到cdn；再引用cdn的文件；
* 以上做法是可加速；但是一点改动比较频繁的话，每次都要在编译后把umi.js 传到cdn，会很麻烦；建议的做法是把 依赖第三方一些 js 、css分离出来；这些是基本不会随着每次编译而改变；把他们上传到cdn即可；具体做法：


```
vim .umirc.js 在plugins里面添加以下内容
//.umirc.js
 plugins: [
 	...
	['umi-plugin-auto-externals', {
      packages: [ 'antd' ],
      urlTemplate: 'https://unpkg.com/{{ library }}@{{ version }}/{{ path }}',
      checkOnline: false,
    }],
  ]
```

```
tyarn add 'umi-plugin-auto-externals'; 
tyarn add 'moment';
umi build;
```

* 最后把生成的 unpkg.com 文件上传到国内的七牛云； 修改index.html 文件的引用地址为新地址；

### 第四阶段（属优化，可选操作）：seo友好
* 打开 dist/index.html；会看到里面body里面只有：```<div id="root"></div>```；真正的内容是在js来生成的；这样对seo非常不友好；我们需要预渲染；在服务器返回给浏览器的时候就把内容渲染好了；umi需要seo友好化；咋做？
* 查看umi说明文档里面的这个介绍： https://umijs.org/zh/guide/ssr.html#%E9%A2%84%E6%B8%B2%E6%9F%93%EF%BC%88pre-render%EF%BC%89  ；基本讲清楚了；写这篇博文的时候，该组件还是beta版，部分场景会无法成功渲染；
* 我只需渲染部分页面，所以选择在编译的时候进行渲染，操作如下：

```
vim .umirc.js 添加以下内容：
//.umirc.js
ssr: true,
 plugins: [
 ...
['@umijs/plugin-prerender', {}],
],
```

```
yarn add '@umijs/plugin-prerender'
umi build
```

### 第五阶段: 服务器设置：
* 因为是spa应用；所以需要设置为不存在的路由都走 index.html 入口：以下为nginx配置

```
server {
    listen 80;
    server_name www.xxxx.com;
    root /www/static/;

    index index.html index.htm index.php;

    charset utf-8;


    location / {
	    try_files $uri @fallback;
	    autoindex on;
    }
	location @fallback {
	    rewrite .* /index.html break;
	}
	
    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log /www/log/api.log;
    error_log  /www/log/api.error.log;


    location ~ /\.ht {
        deny all;
    }
}
```

### 完结
* 至此1天内撸完一个官网并上线；就讲解完了；里面的一些操作；比如编译、发布、修改cdn地址；这些都可以用脚本自动化走一下；具体可以看我的git代码；
* 说明一下： 编译阶段进行预渲染，我使用的时候，简单的页面模板可以成功，复杂一点的不行；建议改成用服务端渲染的方式


