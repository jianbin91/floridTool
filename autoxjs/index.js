/**
 * 
 * 运行方式：打开服务 autojs start server
 * autoxjs：打开无障碍，以及设置电脑连接 
 */

//剪贴板
var tkl = '【淘宝】https://m.tb.cn/h.UvgHtLN?tk=Y9NgdNPog4u CZ3457 「1.54寸bilibili哔哩哔哩B站Misaka漂亮的SD2WIFI天气时钟触摸款」';
setClip(tkl);


//打开app
launchApp("淘宝");

sleep(8000);

//点击查看详情
clickBtnByDesc("查看详情", 4000);

//建议改成waitfor的方法
sleep(3000);





//手势操作.
gesture(1000, [500, 500], [100, 100]);

// 请求截图
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}

var path = "/storage/emulated/0/Download/screenshot-tb3.png";
captureScreen(path);

var img = images.read(path);
let res = paddle.ocrText(img);

console.log("识别信息: " + JSON.stringify(res))



function clickBtnByDesc(btnText,waitingDelay){//传入一个按钮，确保点击了该按钮（搭配findOne，可能传入null或按钮）
    var btn = desc(btnText).clickable(true).findOne(waitingDelay);//在给定时间内持续寻找，直到找到
    if(!btn)return false;//未在给定时间内找到按钮
    while(!btn.click());//不断点击按钮直到成功，因此之前要确保按钮是可点击的
    return true;
}
