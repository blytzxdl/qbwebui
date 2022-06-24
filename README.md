# qBittorrent Web UI

## 开发调试

```
yarn serve
```

## 上线示例 [qBittorrent](https://qb.xiezi08.ink/).

由于安全、成本、政策等原因

<font color=red>示例使用国外渣vps反向代理连接，请尽量使用IPv6访问，访问较慢，偶尔掉线，出现问题请尝试刷新</font>

目前每天都会检查，无法连接时可见下方预览，基本展示了所有功能，见谅

账号:guest

密码:testqbwebui

## dev分支重构中

当前版本是本人自学后照虎画猫的成果，对应用架构的规划不太充分，有些地方为了巩固知识没有使用更好的解决方案，因此准备在dev分支进行重构：

- 基于移动版开发，响应式，渐进增强
- 优化数据结构和数据管理，减少网络和性能开销
- 美化UI
- 计划新功能(不分先后)：
  - 基于echart的速度统计
  - 速度限制切换
  - 中文翻译
  - 下载内容管理
  - 通过种子文件添加下载
  - 本地存储个人配置项
  - 主题切换
  - ...

## 当前版本界面预览

![动画](preview/README/动画.gif)![image-20220621170723211](preview/README/image-20220621170723211-16558077657981.png)

![image-20220621165810461](preview/README/image-20220621165814123.png)

![image-20220621165810461](preview/README/image-20220621165810461.png)

![image-20220621170020500](preview/README/image-20220621170020500.png)

![image-20220621165850102](preview/README/image-20220621165850102.png)

![image-20220621170531047](preview/README/image-20220621170531047.png)

![image-20220621170557602](preview/README/image-20220621170557602.png)

![image-20220621170630405](preview/README/image-20220621170630405.png)