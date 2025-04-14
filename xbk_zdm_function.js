//********用户配置区域开始*****************************************
// 版本号：2.0
// 线报酷-值得买精选好价 http://new.xianbao.fun/category-zhidemai/
// 1.1版本：集成MeoW推送
// ...
// 2.0版本：为小白用户重写并内置推送格式，并且可以推送图文内容

const fs = require('fs');
const got = require('got');
const path = require('path');
function zdm_listfilter(group,zdm_config){const zdm_arr=Object.values(zdm_config);for(const item of zdm_arr){if(item.Status!==1){continue}if(group.type!=="smzdm"){continue}if(group.mall_name&&item.mall_name&&!new RegExp(item.mall_name).test(group.mall_name)){continue}if((item.Miprice!==""&&group.price!==""&&Number(group.price)<Number(item.Miprice))||(item.Mxprice!==""&&group.price!==""&&Number(group.price)>Number(item.Mxprice))){continue}if(group.title&&zdm_checkMatches(item.title_gjc,item.title_pbc,group.title)){continue}if(group.brand&&zdm_checkMatches(item.brand_gjc,item.brand_pbc,group.brand)){continue}if(group.category_name&&zdm_checkMatches(item.category_gjc,item.category_pbc,group.category_name)){continue}return true}return false}
function zdm_checkMatches(item_gjc,item_pbc,groupValue){const gjcMatches=item_gjc&&new RegExp(item_gjc).test(groupValue);const pbcMatches=item_pbc&&new RegExp(item_pbc).test(groupValue);if(gjcMatches&&pbcMatches){return true}if(item_gjc&&!gjcMatches){return true}if(item_pbc&&pbcMatches){return true}}
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


//下面引用xbk_sendNotify.js.js推送函数
//如果要设置不同的推送规则，复制一个新的文件xbk_sendNotify2.js，引用新的文件，例如：const notify = require('./xbk_sendNotify2');
const notify = require('./xbk_sendNotify.js');


//检测的线报酷域名，支持的域名有 http://new.ixbk.net，http://new.xianbao.fun, http://new.ixbk.fun 
const domin = 'http://new.ixbk.net';

//下方newUrl是请求线报酷最新15条值得买文章
const newUrl = domin + '/plus/json/push_19.json';


//设置筛选规则，规则和线报酷用户中心值得买监控词一样 http://new.xianbao.fun/gonggao/3909547.html
//如需导入线报酷规则(多个规则设置)，先在线报酷设置好后，在值得买页面F12控制台，输入zdm_config，然后回车 右键复制object值到这里即可
//详细教程：
const zdm_config={
    "midV6diztrS": {
        "Status": 1,//状态开启
        "mall_name": "",//检测商城名称
        "title_gjc": "",//标题关键词
        "title_pbc": "",//标题屏蔽关键词
        "brand_gjc": "",//品牌关键词
        "brand_pbc": "",//品牌屏蔽词
        "category_gjc": "",//分类关键词
        "category_pbc": "",//分类屏蔽词
        "Miprice": "",//最低价
        "Mxprice": "10"//最高价
    }
}



console.debug('开始获取线报酷-值得买数据...');

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
            if (!isMessageInFile(item, "zdm.json")) {
                appendMessageToFile(item, "zdm.json");
                if (zdm_listfilter(item, zdm_config)) {
                    items.push(item);
                } else {
                    //console.log("-----------------------------");
                    //console.log(`数据因你的设置被全局屏蔽：${item.title}【${item.category_name}】 价格:${item.price}  ${item.url}`);
                }
            }

        })


        //这里是最后的推送设置，用户可以修改部分推送格式******************
        //这里是最后的推送设置，用户可以修改部分推送格式******************
        let hebingdata = "";
        items.forEach(item => {
            //定义推送格式：{标题}{内容}{Html内容}{Markdown内容}{链接}{分类名}{分类ID}{日期}{时间}
            //xbk_zdm_function 值得买分类额外自定义参数：{类目}{价格}{商城}{品牌}{图片}

            let text = "【{价格}】元 {标题}";
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
            console.log("发现到新数据：");
            console.log(`${item.title}【${item.category_name}】 价格:${item.price}  ${item.url}`);

            
            //定义合并推送内容格式
            if (hebingdata) {
                //合并换行符
                hebingdata += "\n\n";
            }

            //合并推送格式： 
            hebingdata += tuisong_replace("{标题}【{商城}】 价格：{价格} {链接}",item);

        })


        //-----------------------------------------------
        //这里是合并发布内容(多条信息合并起来发送)，自己把下面//注释解除，然后把上面单条信息的notify.sendNotify 加上//注释

        //if(hebingdata){
        //notify.sendNotify(hebingdata, "提示");
        //}

        console.log("\n\n\n\n*******************************************");
        console.log("*******************************************");
        console.debug(`获取到线报酷值得买${xbkdata.length}条数据，筛选后的新数据${items.length}条，本次任务结束`);

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