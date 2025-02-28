// ==UserScript==
// @name         百度网盘智能字幕下载
// @namespace    https://github.com/jianbin91/floridTool
// @version      0.5
// @description  自动将百度网盘生成的智能字幕下载为 srt 文件，增加下载按钮
// @match        *://pan.baidu.com/*
// @grant        GM_download
// @license      GPL3
// ==/UserScript==


// ==UserScript== 更早版本，参考自--- 
// @name         百度网盘智能字幕下载
// @namespace    http://github.com/lihaoze123/Baiduyun-subtitle-downloader
// @version      0.4
// @description  自动将百度网盘生成的智能字幕下载为 srt 文件，增加下载按钮
// @match        *://pan.baidu.com/*
// @grant        GM_download
// @license      GPL3
// ==/UserScript==


(function () {
    'use strict';

    function clearResources() {
        performance.clearResourceTimings();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function retryOperation(operation, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`尝试失败,${maxRetries - i - 1}次重试后重新尝试`);
                await sleep(delay);
            }
        }
    }

    async function findSubtitleUrl() {
        const resources = performance.getEntriesByType("resource");
        let matchedUrls = resources.filter(resource => resource.name.includes('netdisk-subtitle'));

        if (matchedUrls.length > 0) {
            let url = matchedUrls[matchedUrls.length - 1].name;
            console.log('找到匹配的URL:', url);
            return url;
        } else {
            throw new Error('未找到匹配的URL');
        }
    }

    async function downloadSubtitle() {

        

        const hostElement = document.querySelector("#video-root"); // 例如 video-player, .player-container 等

        if (!hostElement && !hostElement.shadowRoot) {
            console.log('未找到hostElement');
            return false;
        }


            // 在Shadow DOM中查找按钮
        //     const buttonPlay = hostElement.shadowRoot.querySelector("#html5player > button");

        //     if (buttonPlay) {
        //         // 模拟点击
        //         button.click();
        //         console.log("按钮被点击");
        //     } else {
        //         console.log("在Shadow DOM中未找到按钮");
        //     }
        
        // return;

        const buttonPlay = hostElement.shadowRoot.querySelector("#html5player > button");

        console.log(buttonPlay);

        if (!buttonPlay) {
            console.log('在Shadow DOM中未找到播放');
            return;
        }

        buttonPlay.click();
        await sleep(500);
       hostElement.shadowRoot.querySelector("#video-player").click();   //暂停

        // buttonPlay.click(); //暂停
        // await sleep(500);


        const button1 = hostElement.shadowRoot.querySelector("#html5player > div.vjs-control-bar > div.vjs-subtitle-wrapper.vjs-full-menu.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button");


        if (!button1) {
            console.log('未找到字幕按钮1');
            return;
        }

        button1.click();


        await sleep(500);

        const button2 = hostElement.shadowRoot.querySelector("#html5player > div.vjs-control-bar > div.vjs-subtitle-wrapper.vjs-full-menu.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button > div.vjs-menu.ai-subtitle > ul > div.vjs-subtitle-list-wrap > li > div:nth-child(2) > span");

        if (!button2) {
            console.log('未找到字幕按钮2');
            return;
        }

        clearResources(); // 清理资源
        button2.click();

        await sleep(500);

        try {
            const url = await retryOperation(findSubtitleUrl);
            const regex = /fn=(.*)\.mp4/;
            let fileName = decodeURI(url.match(regex)[1]).replace('+', ' ') + '.srt';
            console.log(fileName);

            GM_download(url, fileName);
        } catch (error) {
            console.error('下载失败:', error);
        }
 
    }

    function addDownloadButton() {
        //        const controlBar = document.querySelector("#vjs_video_594 > section > div.vp-video__control-bar--setup > div:nth-child(1) > div > div.vp-inner-vontainer > div > div.vp-video__control-bar--video-subtitles > div > ul");
        console.log('in');
        const controlBar = document.querySelector('#video-toolbar > div.video-toolbar-buttonbox');
        console.log(controlBar);
        if (controlBar) {
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '下载字幕';
            downloadButton.style.cssText = `
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 5px 10px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 4px;
            `;
            downloadButton.addEventListener('click', downloadSubtitle);
            controlBar.appendChild(downloadButton);
            return true;
        }
        return false;
    }

    // 在页面加载前执行此代码
    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init) {
        // 强制使用open模式
        const shadow = originalAttachShadow.call(this, { mode: 'open' });
        console.log('Shadow DOM创建于:', this);
        return shadow;
    };

    const observer = new MutationObserver((mutations, obs) => {
        if (addDownloadButton()) {
            obs.disconnect();
            return;
        }
    });

    const config = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, config);

    let count = 0;
    const interval = setInterval(() => {
        if (!document.querySelector("#video-toolbar > div.video-toolbar-buttonbox > button")) {
            addDownloadButton();
        }
        count++;
        if (count >= 10) {
            clearInterval(interval); // 清除定时器,防止重复执行
        }
    }, 1000);
})();
