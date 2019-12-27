## 提交代码一段时间后自动弹窗通知测试

##### 工具介绍
* 发布代码后，会触发自动部署，因为是用容器化的方式，所以，一般会需要1分钟左右的部署时间；该工具会在发布代码1分钟后，弹出通知框，告知要去测试；点击通知栏会自动跳到浏览器；
*  目前设置了通知时间是代码提交后 66秒弹出通知；如果要修改这个时间，则修改 commmit-msg-handle 里面的等待时间即可
*  commit msg 里面需要有 http链接，才会触发弹窗通知

##### 部署
* 把 src 代码复制到 项目里面的 .git/hook/; 并且修改权限：chmod +x  commit-msg; chmod 777 commit-msg-handle;


##### 依赖的组件
* https://github.com/julienXX/terminal-notifier 弹窗；并支持点击链接；
* https://github.com/BurntSushi/ripgrep  替代grep；因为mac底下的grep正则的标准和linux下不一致；

##### 参考资料
* git的钩子： https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90 用到里面的commit-msg
* 触发异步进程的方式： https://stackoverflow.com/questions/27624850/launch-a-completely-independent-process

:
