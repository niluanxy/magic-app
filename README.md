#MagicAPP

<p>MagicAPP，专为WebAPP而生的开发框架，致力于轻松的写代码，产出用户体验优秀的APP。生成代码可以直接用于移动端，微信端。结合打包工具，可以非常方便的转为原生APP，供用户下载使用。</p>

<p>框架自带一整套的UI，同时整体架构合理灵活，各部分可以单独拆出运行，亦可与其他的框架，库等配合使用。目前框架处于开发预览阶段，可能会有极大的改动，使用请注意。</p>

##基本使用方法:
###1.安装依赖工具及初始化
```JavaScript
npm install
npm install -g gulp cordova
gulp build
```
###2.监控运行
```JavaScript
gulp serve
```

##Cordova 打包说明:
###1.创建 Cordova 文件夹
<p>先在 <b>项目根目录下</b> 创建一个 cordova 的项目，命令说明如下：</p>

```CLI
cordova create [文件夹名] [软件ID] [Main方法名]
```

<p>目前，为了脚本处理方便，文件夹名必须为 cordova，其它两个参数可自定义，比如：</p>

```CLI
cordova create cordova com.wbasic.weishop weishop
```

###2.添加编译平台
<p>项目创建完毕后，必须先添加编译平台，命令如下:</p>

```CLI
cordova platfrom add [平台名](android/ios)
```
<p>比如添加 Android 平台可以执行如下命令：</p>
```CLI
cordova platform add android
```

###3.执行打包操作
<p>每次打包，都需要 <b>先编译HTML文件</b>，然后打包成APP安装文件，如果已经编译过了，可以直接打包成安装文件。</p>
<p>编译HTML文件需要在项目根目录执行以下命令：</p>
```CLI
gulp cordova
```
<p><b>编译完成后</b>在 <b>cordova 根目录</b> 执行 cordova build [平台] 命令来生成对应平台安装文件，也可以直接运行 cordova run [平台] 命令来生成打包文件并安装到设备上，比如对于 android 平台则可执行：</p>
```CLI
cordova build android      ## 只生成安装文件
cordova run android        ## 生成并安装文件
```

###4.配置文件修改说明
<p>有时候需要修改配置文件，比如 <b>安卓平台的 AndroidManifest.xml</b> 文件，但是有时候修改后编译会失败，提示：<b>You may not have the required environment or OS to build this project.</b></p>
<p>导致这个情况是由于有的插件会自动插入一些配置信息，如果你更改了最终的配置信息，<b>两者不匹配</b> 的话，就会出错。因此我们只要保证自动插入的信息和最终的配置信息一致就可以。</p>
<p>比如对于安卓平台，自动配置文件是 <b>plugins/android.json</b> 文件，所以我们只要保证 <b>android.json</b> 和 <b>AndroidManifest.xml</b> 两个文件的配置信息一致，那么修改就不会出错。</p>