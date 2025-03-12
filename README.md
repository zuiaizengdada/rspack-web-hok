用户端服务器 ip http://120.77.12.222:8090
swagger 地址http://120.77.12.222:8090/doc.html  
管理后台服务器 ip http://120.77.12.222:8070

<!-- http://dev.admin-backend.hokkj.cn -->

swagger 地址http://120.77.12.222:8070/doc.html  
测试环境域名：http://hokkj.cn/  
http://120.77.12.222:9002/ 后台管理
http://120.77.12.222:9001/ H5
jenkins: http://120.77.12.222:8080/

高德

| 环境 | key                              | 密匙                             |
| ---- | -------------------------------- | -------------------------------- |
| 测试 | 9f2893c190fb7c5330cb83b09b03413f | 0b281b8656e90722a158ad50f3dc9504 |
| 生产 | f91f26c8d54241be4c892afed9708f82 | 9ca9145f2b120c4e499bd1c4b2dcf5e7 |

开发注意事项：

1.svg 文件的处理
1.1 处理：
svg 已经通过 svg-sprite-loader loader 对在目录 src/icon 所有的 svg 文件转换为 svg 雪碧图。

1.2 使用：
直接通过 svg-icon 组件使用，组件在 src/components/Svgicon。一些使用规范看组件实现。目前为了兼容以前老的 代码较为冗余 todo

1.3 注意事项：
svg 文件最好不设置 fill(目前蓝湖下载 svg，都是默认设置，可直接修改 svg 文件)，能够让 svg 能够继承父类颜色，

- svg、path 标签 fill 删除
- ellipse 标签 stroke="currentColor"

这样可以让 svg 文件继承组件中设置的 color/fill 的颜色
1.4 可优化点：

- 1. svg 组件优化，目前存在冗余代码(为了兼容历史使用)
- 2）svg 打包优化，目前打包是直接转换 base64，而非雪碧图，目前插件试尝有成熟的 plugin 解决
