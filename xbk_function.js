//********用户配置区域开始*****************************************
// 版本号：2.0
// 1.2版本：集成wxpusher推送，修复某些情况读写历史记录出错
// 1.3版本：集成微信公众号息知推送，继续修复读写历史记录出错
// 1.4版本：修复读写历史记录出错
// 1.4版本：集成MeoW推送
// ...
// 2.0版本：为小白用户重写并内置推送格式，并且可以推送图文内容


const notify = require('./xbk_sendNotify');
const fs = require('fs');
const got = require('got');
const path = require('path');
function daysComputed(time) { var oldTimeFormat = new Date(time.replace(/-/g, '/')); var nowDate = new Date(); if (nowDate.getTime() - oldTimeFormat.getTime() > 0) { var times = nowDate.getTime() - oldTimeFormat.getTime(); var days = parseInt(times / (60 * 60 * 24 * 1000)); return days } else { return 0 } }
function listfilter(group, pingbifenlei, pingbilouzhu, zhanxianlouzhu, pingbilouzhuplus, pingbibiaoti, zhanxianbiaoti, pingbibiaotiplus, pingbineirong, zhanxianneirong, pingbineirongplus, pingbitime) { var louzhubaoliu, biaotibaoliu, neirongbaoliu, louzhupingbi, louzhupingbiplus, biaotipingbi, biaotipingbiplus, neirongpingbi, neirongpingbiplus; if (pingbitime && group.louzhuregtime) { if (pingbitime.match(new RegExp(/###/), "g")) { pingbitimearr = pingbitime.split(/<br>|\n\n|\r\n/); for (j = 0; j < pingbitimearr.length; j++) { xiaopingbitimearr = pingbitimearr[j].split("###"); if (group.catename.match(new RegExp(xiaopingbitimearr[0], "i")) && xiaopingbitimearr[1] > daysComputed(group.louzhuregtime)) { return false } } } else { if (pingbitime > daysComputed(group.louzhuregtime)) { return false } } } if (pingbifenlei && group.catename) { if (group.catename.match(new RegExp(pingbifenlei, "i"))) { return false } } if (zhanxianlouzhu && group.louzhu) { if (zhanxianlouzhu.match(new RegExp(/###/), "g")) { zhanxianlouzhuarr = zhanxianlouzhu.split(/<br>|\n\n|\r\n/); for (j = 0; j < zhanxianlouzhuarr.length; j++) { xiaozhanxianlouzhuarr = zhanxianlouzhuarr[j].split("###"); if (group.catename.match(new RegExp(xiaozhanxianlouzhuarr[0], "i")) && group.louzhu.match(new RegExp(xiaozhanxianlouzhuarr[1], "i"))) { louzhubaoliu = 1 } } } else { if (group.louzhu.match(new RegExp(zhanxianlouzhu, "i"))) { louzhubaoliu = 1 } } } if (pingbilouzhu && group.louzhu && louzhubaoliu != 1) { if (pingbilouzhu.match(new RegExp(/###/), "g")) { pingbilouzhuarr = pingbilouzhu.split(/<br>|\n\n|\r\n/); for (j = 0; j < pingbilouzhuarr.length; j++) { xiaopingbilouzhuarr = pingbilouzhuarr[j].split("###"); if (group.catename.match(new RegExp(xiaopingbilouzhuarr[0], "i")) && group.louzhu.match(new RegExp(xiaopingbilouzhuarr[1], "i"))) { louzhupingbi = 1 } } } else { if (group.louzhu.match(new RegExp(pingbilouzhu, "i"))) { louzhupingbi = 1 } } } if (pingbilouzhuplus && group.louzhu && louzhupingbi != 1) { if (pingbilouzhuplus.match(new RegExp(/###/), "g")) { pingbilouzhuplusarr = pingbilouzhuplus.split(/<br>|\n\n|\r\n/); for (j = 0; j < pingbilouzhuplusarr.length; j++) { xiaopingbilouzhuplusarr = pingbilouzhuplusarr[j].split("###"); if (group.catename.match(new RegExp(xiaopingbilouzhuplusarr[0], "i")) && group.louzhu.match(new RegExp(xiaopingbilouzhuplusarr[1], "i"))) { louzhupingbiplus = 1; louzhubaoliu = 0 } } } else { if (group.louzhu.match(new RegExp(pingbilouzhuplus, "i"))) { louzhupingbiplus = 1; louzhubaoliu = 0 } } } if (louzhupingbi == 1 || louzhupingbiplus == 1) { return false } if (zhanxianbiaoti && group.title) { if (zhanxianbiaoti.match(new RegExp(/###/), "g")) { zhanxianbiaotiarr = zhanxianbiaoti.split(/<br>|\n\n|\r\n/); for (j = 0; j < zhanxianbiaotiarr.length; j++) { xiaozhanxianbiaotiarr = zhanxianbiaotiarr[j].split("###"); if (group.catename.match(new RegExp(xiaozhanxianbiaotiarr[0], "i")) && group.title.match(new RegExp(xiaozhanxianbiaotiarr[1], "i"))) { biaotibaoliu = 1 } } } else { if (group.title.match(new RegExp(zhanxianbiaoti, "i"))) { biaotibaoliu = 1 } } } if (pingbibiaoti && group.title && louzhubaoliu != 1 && biaotibaoliu != 1) { if (pingbibiaoti.match(new RegExp(/###/), "g")) { pingbibiaotiarr = pingbibiaoti.split(/<br>|\n\n|\r\n/); for (j = 0; j < pingbibiaotiarr.length; j++) { xiaopingbibiaotiarr = pingbibiaotiarr[j].split("###"); if (group.catename.match(new RegExp(xiaopingbibiaotiarr[0], "i")) && group.title.match(new RegExp(xiaopingbibiaotiarr[1], "i"))) { biaotipingbi = 1 } } } else { if (group.title.match(new RegExp(pingbibiaoti, "i"))) { biaotipingbi = 1 } } } if (pingbibiaotiplus && group.title && louzhubaoliu != 1 && biaotipingbi != 1) { if (pingbibiaotiplus.match(new RegExp(/###/), "g")) { pingbibiaotiplusarr = pingbibiaotiplus.split(/<br>|\n\n|\r\n/); for (j = 0; j < pingbibiaotiplusarr.length; j++) { xiaopingbibiaotiplusarr = pingbibiaotiplusarr[j].split("###"); if (group.catename.match(new RegExp(xiaopingbibiaotiplusarr[0], "i")) && group.title.match(new RegExp(xiaopingbibiaotiplusarr[1], "i"))) { biaotipingbiplus = 1; biaotibaoliu = 0 } } } else { if (group.title.match(new RegExp(pingbibiaotiplus, "i"))) { biaotipingbiplus = 1; biaotibaoliu = 0 } } } if (biaotipingbi == 1 || biaotipingbiplus == 1) { return false } if (zhanxianneirong && group.content) { if (zhanxianneirong.match(new RegExp(/###/), "g")) { zhanxianneirongarr = zhanxianneirong.split(/<br>|\n\n|\r\n/); for (j = 0; j < zhanxianneirongarr.length; j++) { xiaozhanxianneirongarr = zhanxianneirongarr[j].split("###"); if (group.catename.match(new RegExp(xiaozhanxianneirongarr[0], "i")) && group.content.match(new RegExp(xiaozhanxianneirongarr[1], "i"))) { neirongbaoliu = 1 } } } else { if (group.content.match(new RegExp(zhanxianneirong, "i"))) { neirongbaoliu = 1 } } } if (pingbineirong && group.content && louzhubaoliu != 1 && biaotibaoliu != 1 && neirongbaoliu != 1) { if (pingbineirong.match(new RegExp(/###/), "g")) { pingbineirongarr = pingbineirong.split(/<br>|\n\n|\r\n/); for (j = 0; j < pingbineirongarr.length; j++) { xiaopingbineirongarr = pingbineirongarr[j].split("###"); if (group.catename.match(new RegExp(xiaopingbineirongarr[0], "i")) && group.content.match(new RegExp(xiaopingbineirongarr[1], "i"))) { neirongpingbi = 1 } } } else { if (group.content.match(new RegExp(pingbineirong, "i"))) { neirongpingbi = 1 } } } if (pingbineirongplus && group.content && louzhubaoliu != 1 && biaotibaoliu != 1 && neirongpingbi != 1) { if (pingbineirongplus.match(new RegExp(/###/), "g")) { pingbineirongplusarr = pingbineirongplus.split(/<br>|\n\n|\r\n/); for (j = 0; j < pingbineirongplusarr.length; j++) { xiaopingbineirongplusarr = pingbineirongplusarr[j].split("###"); if (group.catename.match(new RegExp(xiaopingbineirongplusarr[0], "i")) && group.content.match(new RegExp(xiaopingbineirongplusarr[1], "i"))) { neirongpingbiplus = 1; neirongbaoliu = 0 } } } else { if (group.content.match(new RegExp(pingbineirongplus, "i"))) { neirongpingbiplus = 1; neirongbaoliu = 0 } } } if (neirongpingbi == 1 || neirongpingbiplus == 1) { return false } return true }
function add0(m) {return m < 10 ? '0' + m : m};
function tuisong_replace(text,shuju){if(shuju.category_name){shuju.catename=shuju.category_name}if(shuju.posttime){let posttime=new Date(shuju.posttime*1000);shuju.datetime=`${posttime.getFullYear()}-${add0(posttime.getMonth()+1)}-${add0(posttime.getDate())}`;shuju.shorttime=`${posttime.getHours()}:${add0(posttime.getMinutes())}`}content_html=`${shuju.content_html}<br>&nbsp;<br>&nbsp;<br>原文链接：<a href="${shuju.url}"target="_blank">${shuju.url}</a><br>&nbsp;<br>&nbsp;<br>`;const replacements={'{标题}':shuju.title,'{内容}':shuju.content,'{Html内容}':content_html,'{Markdown内容}':htmlToMarkdown(shuju),'{分类名}':shuju.catename,'{分类ID}':shuju.cateid,'{链接}':shuju.url,'{日期}':shuju.datetime,'{时间}':shuju.shorttime,'{楼主}':shuju.louzhu,'{类目}':shuju.category_name,'{价格}':shuju.price,'{商城}':shuju.mall_name,'{品牌}':shuju.brand,'{图片}':shuju.pic};for(const[key,value]of Object.entries(replacements)){if(value!==undefined){text=text.replace(new RegExp(key,'g'),value)}else{text=text.replace(new RegExp(key,'g'),'')}}return text}
function htmlToMarkdown(shuju){let html=shuju.content_html?shuju.content_html:'';html=html.replace(/<h([1-6])>(.*?)<\/h\1>/gi,function(match,level,content){return'#'.repeat(level)+' '+content+'\\n\\n'});html=html.replace(/<a\s+href="(.*?)".*?>(.*?)<\/a>/gi,'[$2]($1)');html=html.replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi,'\n\n![$2]($1)\n\n');html=html.replace(/<img[^>]+src="([^"]+)"[^>]*>/gi,'\n\n![]($1)\n\n');html=html.replace(/<br\s*\/?>/gi,'\n\n');html=html.replace(/<p[^>]*>/gi,'\n\n');html=html.replace(/<\/p>/gi,'\n\n');html=html.replace(/<[^>]+>/g,'');html=html.replace(/\n{3,}/g,'\n\n');html=`${html}\n\n原文链接：[${shuju.url}](${shuju.url})\n\n\n\n`;return html.trim()}
const DATA_DIR=path.join(__dirname,'xianbaoku_cache');if(!fs.existsSync(DATA_DIR)){fs.mkdirSync(DATA_DIR)}
function getFilePath(filename){return path.join(DATA_DIR,filename)}
function ensureFileExists(filePath){if(!fs.existsSync(filePath)){fs.writeFileSync(filePath,'[]','utf8')}}
function fixJsonFile(filePath){ensureFileExists(filePath);try{const content=fs.readFileSync(filePath,'utf8');JSON.parse(content||'[]')}catch(error){console.error(`JSON解析错误，重置文件${filePath}:`,error.message);fs.writeFileSync(filePath,'[]','utf8')}}
function readMessages(filePath){fixJsonFile(filePath);const data=fs.readFileSync(filePath,'utf8');return JSON.parse(data||'[]')}
function isMessageInFile(message,filename){const filePath=getFilePath(filename);const messages=readMessages(filePath);return messages.some(existing=>existing.id===message.id)}
function stringifySafe(obj){try{return JSON.stringify(obj,null,2)}catch(error){console.error('无法序列化对象:',error.message);return'[]'}}
function appendMessageToFile(message,filename){const filePath=getFilePath(filename);ensureFileExists(filePath);const messages=readMessages(filePath);const existingIndex=messages.findIndex(m=>m.id===message.id);if(existingIndex>=0){messages[existingIndex]={...message,timestamp:new Date().toISOString()}}else{messages.push({...message,timestamp:new Date().toISOString()})}if(messages.length>100){messages.splice(0,messages.length-100)}fs.writeFileSync(filePath,stringifySafe(messages),'utf8')}
function getFileName(url){const parts=url.split('/');let filename=parts[parts.length-1];if(!filename.endsWith('.json')){filename+='.json'}return filename}
//****以上代码不懂代码请勿修改*****用户还需要拉到底部修改最后的推送设置**************
//****以上代码不懂代码请勿修改*****用户还需要拉到底部修改最后的推送设置**************



//定义推送的线报酷域名，支持的域名有 http://new.ixbk.net，http://new.xianbao.fun, http://new.ixbk.fun，http://news.ixbk.net，http://news.xianbao.fun
const domin = 'http://new.ixbk.net';

//下方newUrl是请求线报酷最新10条文章
const newUrl = domin + '/plus/json/push.json';

// 获取线报酷最新内容：请求限制：最快5秒请求一次，频繁获取封IP
// 最新10条文章：const newUrl = domin + '/plus/json/push.json';

// 获取线报酷排行榜内容：请求限制：最快300秒请求一次，频繁获取封IP
// 一小时：const newUrl = domin + '/plus/json/rank/yixiaoshi.json';
// 三小时：const newUrl = domin + '/plus/json/rank/sanxiaoshi.json';
// 六小时：const newUrl = domin + '/plus/json/rank/liuxiaoshi.json';


//分类屏蔽
//网站所有的分类有：赚客吧|赚客吧热帖|新赚吧|新赚吧热帖|微博线报|线报活动|食品饮料|个护美妆|服饰鞋帽|居家生活|母婴儿童|数码电子|运动户外|宠物天地|医疗保健|更多好物|豆瓣线报|豆瓣买组|豆瓣拼组|豆瓣发组|豆瓣狗组|爱猫生活|爱猫澡盆|小嘀咕|酷安|葫芦侠三楼|小刀娱乐网|3K8资讯网|技术QQ网|YYOK大全|活动资讯网|免费赚钱中心
//微博所有的分类有：线报活动|食品饮料|个护美妆|服饰鞋帽|居家生活|母婴儿童|数码电子|运动户外|宠物天地|医疗保健|更多好物
//豆瓣所有的分类有：买组|拼组|发组|狗组|爱猫生活|爱猫澡盆
const pingbifenlei = '';


//以下筛选设置同线报酷用户中心一模一样
//如需用户中心换行效果，使用<br>代替

//线报酷用户中心学习文档：http://new.xianbao.fun/wendang.html
//全局列表筛选详细教程：http://new.ixbk.net/jiaocheng/587024.html
//不同分类列表筛选设置：http://new.ixbk.net/jiaocheng/1015278.html

//全局标题屏蔽
const pingbibiaoti = '';
//全部标题强制展现
const zhanxianbiaoti = '';
//全部标题强制屏蔽(强化)
const pingbibiaotiplus = '';

//全局内容屏蔽
const pingbineirong = '';
//全部内容强制展现
const zhanxianneirong = '';
//全部内容强制屏蔽(强化)
const pingbineirongplus = '';

//全部楼主屏蔽
const pingbilouzhu = '';
//全部楼主强制展现
const zhanxianlouzhu = '';
//全部楼主强制屏蔽(强化)
const pingbilouzhuplus = '';

//赚客吧/新赚吧楼主注册日期屏蔽
const pingbitime = "5";


console.debug('开始获取线报酷数据...');
got(newUrl, {
    timeout: 10000,  // 10秒超时
    retry: {         // 自动重试配置
        limit: 2,    // 最多重试2次
        methods: ['GET']  // 只对GET请求重试
    }
})
    .json()  // 自动解析JSON响应
    .then((xbkdata) => {
        let items = [];
        xbkdata.forEach(item => {
            //这里判断之前有没有获取过本文章
            if (!isMessageInFile(item, getFileName(newUrl))) {
                appendMessageToFile(item, getFileName(newUrl));
                //进行全部屏蔽判断
                if (listfilter(item, pingbifenlei, pingbilouzhu, zhanxianlouzhu, pingbilouzhuplus, pingbibiaoti, zhanxianbiaoti, pingbibiaotiplus, pingbineirong, zhanxianneirong, pingbineirongplus, pingbitime)) {
                    items.push(item);
                } else {
                    //console.log("-----------------------------");
                    //console.log("数据因你的设置被全局屏蔽："+item.title+"【"+item.catename+"】"+domin+item.url);
                }
            }

        })

        
        // 只看它标题推送设置 https://new.xianbao.fun/jiaocheng/3854614.html
        let zkt_gjc = '';


        // 只看它推送设置
        let filteredItems = [];
        items.forEach(item => {
            if (listfilter(item, "", "", "", "", "(.*)", zkt_gjc ? zkt_gjc : "(.*)", "", "", "", "", "")) {
                //提示会写代码的，这里可以插入推送代码，可以实现不同只看它推送不同通道
                filteredItems.push(item);
            } else {
                // console.log("-----------------------------");
                // console.log("数据不符合只看它被屏蔽："+item.title+"【"+item.catename+"】"+domin+item.url);
            }
        });
        items = filteredItems;




        //这里是最后的推送设置，用户可以修改部分推送格式******************
        //这里是最后的推送设置，用户可以修改部分推送格式******************
        let hebingdata = "";
        items.forEach(item => {
            item.url = domin + item.url;//拼接原文链接

            //定义推送格式：{标题}{内容}{Html内容}{Markdown内容}{链接}{分类名}{分类ID}{日期}{时间}{楼主}
            //xbk_zdm_function 值得买分类额外自定义参数：{类目}{价格}{商城}{品牌}{图片}

            let text = "{标题}{内容}";
            let desp = "{链接}";

            text=tuisong_replace(text,item);
            desp=tuisong_replace(desp,item);

            notify.sendNotify(text, desp);
            //以上意思就是 填写的参数的推送通道全部推送


            //----------------------------------------
            //也可以设置单独推送某一个推送通道，记得把全部推送注释掉

            //pushplus推送：
            //notify.pushPlusNotify(tuisong_replace("【{分类名}】{标题}",item), tuisong_replace("<h5>{标题}</h5><br>{Html内容}",item)); 
            //pushplus推送排行榜推送时要用这一行：
            //notify.pushPlusNotify(tuisong_replace("【{分类名}】{标题}",item), tuisong_replace('{内容}\n\n\n\n原文链接：<a href="{链接}">{链接}</a>\n\n\n\n',item)); 
            //pushplus推送值得买时要用这一行：
            //notify.pushPlusNotify(tuisong_replace("【{价格}元】{标题}",item), tuisong_replace('购买地址：<a href="{链接}">{链接}</a>\n\n分类：{类目}\n\n到手价：{价格}元\n\n购买平台：\n\n{商城}\n\n品牌：{品牌}\n\n\n\n<img src="{图片}" referrerpolicy="no-referrer">',item));


            //wxpusher推送：
            //notify.wxPusherNotify(tuisong_replace("【{分类名}】{标题}",item), tuisong_replace("<h5>{标题}</h5><br>{Html内容}",item));
            //wxpusher推送排行榜推送时要用这一行：
            //notify.wxPusherNotify(tuisong_replace("【{分类名}】{标题}",item), tuisong_replace('<h5>{标题}</h5><br>{内容}<br>&nbsp;<br>&nbsp;<br>原文链接：<a href="{链接}">{链接}</a><br>&nbsp;<br>&nbsp;<br>&nbsp;<br>',item)); 
            //wxpusher推送值得买时要用这一行：
            //notify.wxPusherNotify(tuisong_replace("【{价格}元】{标题}",item), tuisong_replace('<h3>{标题}</h3><br><br>购买地址：<a href="{链接}">{链接}</a><br>分类：{类目}<br>到手价：{价格}元<br>购买平台：<br>{商城}<br>品牌：{品牌}<br><br><img src="{图片}">',item)); 


            //息知推送：
            //notify.wxXiZhiNotify(tuisong_replace("【{分类名}】{标题}",item), tuisong_replace("{Markdown内容}",item)); 
            //息知排行榜推送时要用这一行：
            //notify.wxXiZhiNotify(tuisong_replace("【{分类名}】{标题}",item), tuisong_replace("{标题}【{分类名}】[{链接}]({链接})",item));
            //息知值得买推送时要用这一行：
            //notify.wxXiZhiNotify(tuisong_replace("【{价格}元】{标题}",item), tuisong_replace("购买地址：[{链接}]({链接})\n\n分类：{类目}\n\n到手价：{价格}元\n\n购买平台：{商城}\n\n品牌：{品牌}\n\n\n\n![](https://image.baidu.com/search/down?url={图片})",item)); 

            //Pushme安卓APP推送
            //notify.pushMeNotify(tuisong_replace("【{分类名}】{标题}",item), tuisong_replace("{Markdown内容}",item)); 
            //Pushme排行榜推送时要用这一行：
            //notify.pushMeNotify(tuisong_replace("【{分类名}】{标题}",item), tuisong_replace("{标题}【{分类名}】[{链接}]({链接})",item)); 
            //Pushme值得买推送时要用这一行：
            //notify.pushMeNotify(tuisong_replace("【{价格}元】{标题}",item), tuisong_replace("购买地址：[{链接}]({链接})\n\n分类：{类目}\n\n到手价：{价格}元\n\n购买平台：{商城}\n\n品牌：{品牌}\n\n\n\n![](https://image.baidu.com/search/down?url={图片})",item));

            //meoWNotify 鸿蒙推送，传入了可点击链接
            //notify.meoWNotify(text, desp, {url: item.url}); 
            
            //iOS Bark APP推送，传入了可点击链接
            //notify.barkNotify(text, desp, {url: item.url});

            //notify.serverNotify(text, desp); 微信server酱
            //notify.wePlusBotNotify(text, desp); 微加机器人
            //notify.ddBotNotify(text, desp); 钉钉机器人
            //notify.qywxBotNotify(text, desp); 企业微信机器人
            //notify.qywxamNotify(text, desp); 企业微信应用/家校推送
            //notify.iGotNotify(text, desp, params); iGot
            //notify.gobotNotify(text, desp); go-cqhttp
            //notify.gotifyNotify(text, desp); gotify
            //notify.chatNotify(text, desp); synolog chat
            //notify.pushDeerNotify(text, desp); PushDeer
            //notify.aibotkNotify(text, desp); 智能微秘书
            //notify.fsBotNotify(text, desp); 飞书机器人
            //notify.smtpNotify(text, desp); SMTP 邮件
            
            //notify.chronocatNotify(text, desp); Chronocat
            //notify.webhookNotify(text, desp); 自定义通知
            //notify.qmsgNotify(text, desp); 自定义通知

            console.log("-----------------------------");
            console.log("发现到新数据：" + item.title + "【" + item.catename + "】" + item.url);


            //定义合并推送内容格式
            if (hebingdata) {
                //合并换行符
                hebingdata += "\n\n";
            }

            //合并推送格式： CAVID KARRIE纯棉抑菌裆 19.9【微博线报-服饰鞋帽-拼多多线报】http://new.ixbk.net/weibo/3617548.html
            
            hebingdata += tuisong_replace("{标题}【{分类名}】{链接}",item);

        })
        //-----------------------------------------------
        //-----------------------------------------------
        //-----------------------------------------------
        //-----------------------------------------------

        //这里是合并发布内容(多条信息合并起来发送)，自己把下面//注释解除，然后把上面单条信息的notify.sendNotify 加上//注释，推送通道同理上面

        //if(hebingdata){
        //notify.sendNotify(hebingdata, "提示");
        //}

        console.log("\n\n\n\n*******************************************");
        console.log("*******************************************");
        console.debug(`获取到${xbkdata.length}条数据，筛选后的新数据${items.length}条，本次任务结束`);

    })
.catch(error => {
        if (error.response) {
            console.log('请求失败，状态码:', error.response.statusCode);
        } else if (error.code === 'ETIMEDOUT') {
            console.log('请求超时:', error.message);
        } else {
            console.log('请求错误:', error.message);
        }
        return [];  // 保持与原逻辑一致，返回空数组
    });