# MagicAPP

<p>MagicAPP，专为WebAPP而生的开发框架，致力于轻松的写代码，产出用户体验优秀的APP。生成代码可以直接用于移动端，微信端。结合打包工具，可以非常方便的转为原生APP，供用户下载使用。</p>

<p>框架自带一整套的UI，同时整体架构合理灵活，各部分可以单独拆出运行，亦可与其他的框架，库等配合使用。目前框架处于开发预览阶段，可能会有极大的改动，使用请注意。</p>

***

## 基本使用方法:
### 1.项目依赖初始化

<p>依赖环境初始化只需在 <b>项目根目录</b> 执行以下命令：</p>

```CLI
sudo npm install -g gulp cordova webpack

npm install
gulp build
```

<p><b>第一条命令会将 gulp 和 cordova 和 webpack 安装到全局环境。</b></p>

<p><b>PS：</b>国内的环境问题，安装可能会很慢，所以建议先安装 <b>nrm</b> 工具，替换为 国内淘宝源，可以极大加快下载速度：</p>

```CLI
sudo npm install -g nrm
nrm use taobao
```

<p>安装完成执行 <b>nrm ls</b> ，如果显示类似下面内容则安装成功：</p>

```CLI
  npm ---- https://registry.npmjs.org/
  cnpm --- http://r.cnpmjs.org/
* taobao - http://registry.npm.taobao.org/
  edunpm - http://registry.enpmjs.org/
  eu ----- http://registry.npmjs.eu/
  au ----- http://registry.npmjs.org.au/
  sl ----- http://npm.strongloop.com/
  nj ----- https://registry.nodejitsu.com/
  pt ----- http://registry.npmjs.pt/
```

<p>现在去执行初始化操作，将极大的缩短依赖下载时间。</p>

### 2.常用命令说明
<p>框架内置了以下常用命令，说明如下：</p>

```CLI
gulp clean               ## 清空编译后的文件，常用于清理项目
gulp build               ## 编译整个项目
gulp build -r            ## 编译项目并压缩，常用于【项目发布】。注意此命
                            令并不包括 cordova 部分。
                            最终生成的文件位于 /app/dist 目录下。为保证
                            文件纯净，建议发布前执行一次清理工作。

gulp dev-mixin           ## 只编译框架 mixin 部分

gulp dev-minjs           ## 只编译框架 minjs 部分

gulp dev-magic-css       ## 只编译框架 magic 部分的 【CSS 文件】
gulp dev-magic-js        ## 只编译框架 magic 部分的 【JS  文件】

gulp dev-magic-vue       ## 只编译框架 magic-vue 部分

gulp cordova-create      ## 创建 cordova 环境
                         ## cordova 相关命令，请具体看 cordova 部分说明
```

### 3.项目开发启动命令

<p>目前框架集成了 <b>livereload</b> 功能，可以做到保存文件，自动刷新浏览器查看效果，只需在 <b>项目根目录</b> 执行下面命令即可：</p>

```CLI
gulp build && gulp serve
```

<p>执行后会 <b>先自动编译项目</b>，编译完成会在浏览器弹出项目预览页面。接下来享受编码过程即可，不用去操心文件编译，浏览器刷新等问题。</p>

***

## Cordova 初始化:

<p><br>Cordova 为开源的一套工具，主要用于将 HTML5 进行包装，编译为可以在手机上运行的程序文件，还能通过插件提供一些 H5 没有的功能，比如硬件设备的访问。</p>

### 1.初始化 Cordova 环境
<p>初始化 cordova 环境，只需在 <b>项目根目录下</b> 执行以下命令：</p>

```CLI
gulp cordova-create
```

### 2.添加编译平台
<p>项目创建完毕后，必须先添加编译平台，命令如下:</p>

```CLI
gulp cordova-[平台名](android/ios)
```

<p>比如添加 <b>Android</b> 平台可以执行如下命令：</p>

```CLI
gulp cordova-android
```

***

## Cordova 编译打包
### 1.正常打包文件
```CLI
gulp cordova-build-[平台名](android/ios)
```
<p>比如编译 <b>Android</b> 的命令如下：</p>

```
gulp cordova-build-android
```

<p><b>编译完成后</b> ，文件会自动生成在 <b>项目根目录 output</b> 文件夹中。</p>

### 2.打包并安装文件

```CLI
gulp cordova-run-[平台名]
```

<p>比如 <b>Android</b> 平台编译并安装到手机上（当前须有已经连接的手机）的命令如下：</p>

```
gulp cordova-run-android
```

<p>然后会先执行 <b>打包任务</b>，完成后自动安装到手机上。 </p>

***

## Cordova 项目配置
### 1.原理描述
<p>由于cordova 的文件很大，而且大多都是自动生成的，没有必要也不应该放到代码管理中去，所以这部分我进行了修改，采用 <b>文件替换</b> 的思路来把配置文件抽离出来。</p>

### 2.目录映射关系(待补充...)
