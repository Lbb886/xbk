//********用户配置区域开始*****************************************
// 版本号：2.0
// 1.2版本：集成wxpusher推送，默认关闭一言
// 1.3版本：集成微信公众号息知推送，继续修复读写历史记录出错
// 1.4版本：集成MeoW推送
// ...
// 2.0版本：为小白用户重写并内置推送格式，并且可以推送图文内容，新增企业微信家校推送，Brak/Pushme/MeoW/企业微信应用 支持#分割多个设备/应用推送

const querystring = require('node:querystring');
const got = require('got');
const path = require('path');
const fs = require('fs');
const timeout = 15000;

const push_config = {
  HITOKOTO: 'false', // 启用一言（随机句子）
  
  // BARK_PUSH：Bark 地址或设备码，例：https://api.day.app/DxHcxxxxxRxxxxxxcm/
  //用 # 分隔多个设备码，例如：deviceKey1#deviceKey2#https://api.day.app/deviceKey3
  BARK_PUSH: '', 
  BARK_ARCHIVE: '', // bark 推送是否存档
  BARK_GROUP: '', // bark 推送分组
  BARK_SOUND: '', // bark 推送声音
  BARK_ICON: '', // bark 推送图标
  BARK_LEVEL: '', // bark 推送时效性
  BARK_URL: '', // bark 推送跳转URL

  DD_BOT_SECRET: '', // 钉钉机器人的 DD_BOT_SECRET
  DD_BOT_TOKEN: '', // 钉钉机器人的 DD_BOT_TOKEN

  FSKEY: '', // 飞书机器人的 FSKEY

  // 推送到个人QQ：http://127.0.0.1/send_private_msg
  // 群：http://127.0.0.1/send_group_msg
  GOBOT_URL: '', // go-cqhttp
  // 推送到个人QQ 填入 user_id=个人QQ
  // 群 填入 group_id=QQ群
  GOBOT_QQ: '', // go-cqhttp 的推送群或用户
  GOBOT_TOKEN: '', // go-cqhttp 的 access_token

  GOTIFY_URL: '', // gotify地址,如https://push.example.de:8080
  GOTIFY_TOKEN: '', // gotify的消息应用token
  GOTIFY_PRIORITY: 0, // 推送消息优先级,默认为0

  IGOT_PUSH_KEY: '', // iGot 聚合推送的 IGOT_PUSH_KEY，例如：https://push.hellyw.com/XXXXXXXX

  PUSH_KEY: '', // server 酱的 PUSH_KEY，兼容旧版与 Turbo 版

  DEER_KEY: '', // PushDeer 的 PUSHDEER_KEY
  DEER_URL: '', // PushDeer 的 PUSHDEER_URL

  CHAT_URL: '', // synology chat url
  CHAT_TOKEN: '', // synology chat token

  // 官方文档：http://www.pushplus.plus/
  PUSH_PLUS_TOKEN: '', // push+ 微信推送的用户令牌
  PUSH_PLUS_USER: '', // push+ 微信推送的群组编码


  //wxpusher 文档：https://wxpusher.zjiecode.com/docs/
  //注意wxpusher填写的是主题ID，而不是用户ID
  WX_pusher_appToken: '',
  WX_pusher_topicIds: '',

  //息知文档：https://xz.qqoq.net/
  //推送地址示例：https://xizhi.qqoq.net/xxxxxxxxxxxxx.send
  WX_XIZHI_KEY: '', 


  //Pushme 安卓APP 官方文档：https://push.i-i.me
  PUSHME_URL: 'https://push.i-i.me',
  PUSHME_KEY: '', //PushMe 的 PUSHME_KEY，多个用#分割

  //MeoW 文档：https://www.chuckfang.com/MeoW/api_doc.html
  //用户昵称，例如这里面的昵称 http://api.chuckfang.com/昵称/
  //用 # 分隔多个用户ID，例如：user1#user2#user3
  MeoW_USER: '', 
  
  // 微加机器人，官方网站：https://www.weplusbot.com/
  WE_PLUS_BOT_TOKEN: '', // 微加机器人的用户令牌
  WE_PLUS_BOT_RECEIVER: '', // 微加机器人的消息接收人
  WE_PLUS_BOT_VERSION: 'pro', //微加机器人调用版本，pro和personal；为空默认使用pro(专业版)，个人版填写：personal

  QMSG_KEY: '', // qmsg 酱的 QMSG_KEY
  QMSG_TYPE: '', // qmsg 酱的 QMSG_TYPE

  QYWX_ORIGIN: 'https://qyapi.weixin.qq.com', // 企业微信代理地址
  // 企业微信应用/企业家校推送
  QYWX_AM: '', 

  /*
    此处QYWX_AM填你企业微信应用消息的值 https://new.xianbao.fun/jiaocheng/505380.html  https://new.xianbao.fun/jiaocheng/566777.html
    微信应用推送(第四个参数为yy)： QYWX_AM依次填入 企业ID,应用Agentld,应用Secret,yy
    微信家校推送(第四个参数为jx)： QYWX_AM依次填入 企业ID,应用Agentld,应用Secret,jx
    注意用,号隔开(英文输入法的逗号)，例如：wwcff56746d9adwers,1000003,B-791548lnzXBE6_BWfxdf3kSTMJr9vFEPKAbh6WERQ,yy
    如需推送多个企业微信应用，使用#分割，一样在后面传入四个参数
    */

  QYWX_KEY: '', // 企业微信机器人的 webhook(详见文档 https://work.weixin.qq.com/api/doc/90000/90136/91770)，例如：693a91f6-7xxx-4bc4-97a0-0ec2sifa5aaa

  TG_BOT_TOKEN: '', // tg 机器人的 TG_BOT_TOKEN，例：1407203283:AAG9rt-6RDaaX0HBLZQq0laNOh898iFYaRQ
  TG_USER_ID: '', // tg 机器人的 TG_USER_ID，例：1434078534
  TG_API_HOST: 'https://api.telegram.org', // tg 代理 api
  TG_PROXY_AUTH: '', // tg 代理认证参数
  TG_PROXY_HOST: '', // tg 机器人的 TG_PROXY_HOST
  TG_PROXY_PORT: '', // tg 机器人的 TG_PROXY_PORT

  AIBOTK_KEY: '', // 智能微秘书 个人中心的apikey 文档地址：http://wechat.aibotk.com/docs/about
  AIBOTK_TYPE: '', // 智能微秘书 发送目标 room 或 contact
  AIBOTK_NAME: '', // 智能微秘书  发送群名 或者好友昵称和type要对应好

  SMTP_SERVICE: '', // 邮箱服务名称，比如 126、163、Gmail、QQ 等，支持列表 https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
  SMTP_EMAIL: '', // SMTP 收发件邮箱，通知将会由自己发给自己
  SMTP_PASSWORD: '', // SMTP 登录密码，也可能为特殊口令，视具体邮件服务商说明而定
  SMTP_NAME: '', // SMTP 收发件人姓名，可随意填写

  // CHRONOCAT API https://chronocat.vercel.app/install/docker/official/
  CHRONOCAT_QQ: '', // 个人: user_id=个人QQ 群则填入 group_id=QQ群 多个用英文;隔开同时支持个人和群
  CHRONOCAT_TOKEN: '', // 填写在CHRONOCAT文件生成的访问密钥
  CHRONOCAT_URL: '', // Red 协议连接地址 例： http://127.0.0.1:16530

  WEBHOOK_URL: '', // 自定义通知 请求地址
  WEBHOOK_BODY: '', // 自定义通知 请求体
  WEBHOOK_HEADERS: '', // 自定义通知 请求头
  WEBHOOK_METHOD: '', // 自定义通知 请求方法
  WEBHOOK_CONTENT_TYPE: '', // 自定义通知 content-type
};

//不引用配置文件的推送配置
/*
for (const key in push_config) {
  const v = process.env[key];
  if (v) {
    push_config[key] = v;
  }
}
*/

const $ = {
  post: (params, callback) => {
    const { url, ...others } = params;
    got.post(url, others).then(
      (res) => {
        let body = res.body;
        try {
          body = JSON.parse(body);
        } catch (error) {}
        callback(null, res, body);
      },
      (err) => {
        callback(err?.response?.body || err);
      },
    );
  },
  get: (params, callback) => {
    const { url, ...others } = params;
    got.get(url, others).then(
      (res) => {
        let body = res.body;
        try {
          body = JSON.parse(body);
        } catch (error) {}
        callback(null, res, body);
      },
      (err) => {
        callback(err?.response?.body || err);
      },
    );
  },
  logErr: console.log,
};

async function one() {
  const url = 'https://v1.hitokoto.cn/';
  const res = await got.get(url);
  const body = JSON.parse(res.body);
  return `${body.hitokoto}    ----${body.from}`;
}

function gotifyNotify(text, desp) {
  return new Promise((resolve) => {
    const { GOTIFY_URL, GOTIFY_TOKEN, GOTIFY_PRIORITY } = push_config;
    if (GOTIFY_URL && GOTIFY_TOKEN) {
      const options = {
        url: `${GOTIFY_URL}/message?token=${GOTIFY_TOKEN}`,
        body: `title=${encodeURIComponent(text)}&message=${encodeURIComponent(
          desp,
        )}&priority=${GOTIFY_PRIORITY}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Gotify 发送通知调用API失败😞\n', err);
          } else {
            if (data.id) {
              console.log('Gotify 发送通知消息成功🎉\n');
            } else {
              console.log(`Gotify 发送通知调用API失败😞 ${data.message}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

function gobotNotify(text, desp) {
  return new Promise((resolve) => {
    const { GOBOT_URL, GOBOT_TOKEN, GOBOT_QQ } = push_config;
    if (GOBOT_URL) {
      const options = {
        url: `${GOBOT_URL}?access_token=${GOBOT_TOKEN}&${GOBOT_QQ}`,
        json: { message: `${text}\n${desp}` },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Go-cqhttp 通知调用API失败😞\n', err);
          } else {
            if (data.retcode === 0) {
              console.log('Go-cqhttp 发送通知消息成功🎉\n');
            } else if (data.retcode === 100) {
              console.log(`Go-cqhttp 发送通知消息异常 ${data.errmsg}\n`);
            } else {
              console.log(`Go-cqhttp 发送通知消息异常 ${JSON.stringify(data)}`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

function serverNotify(text, desp) {
  return new Promise((resolve) => {
    const { PUSH_KEY } = push_config;
    if (PUSH_KEY) {
      // 微信server酱推送通知一个\n不会换行，需要两个\n才能换行，故做此替换
      desp = desp.replace(/[\n\r]/g, '\n\n');
      const options = {
        url: PUSH_KEY.includes('SCT')
          ? `https://sctapi.ftqq.com/${PUSH_KEY}.send`
          : `https://sc.ftqq.com/${PUSH_KEY}.send`,
        body: `text=${text}&desp=${desp}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Server 酱发送通知调用API失败😞\n', err);
          } else {
            // server酱和Server酱·Turbo版的返回json格式不太一样
            if (data.errno === 0 || data.data.errno === 0) {
              console.log('Server 酱发送通知消息成功🎉\n');
            } else if (data.errno === 1024) {
              // 一分钟内发送相同的内容会触发
              console.log(`Server 酱发送通知消息异常 ${data.errmsg}\n`);
            } else {
              console.log(`Server 酱发送通知消息异常 ${JSON.stringify(data)}`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

function pushDeerNotify(text, desp) {
  return new Promise((resolve) => {
    const { DEER_KEY, DEER_URL } = push_config;
    if (DEER_KEY) {
      // PushDeer 建议对消息内容进行 urlencode
      desp = encodeURI(desp);
      const options = {
        url: DEER_URL || `https://api2.pushdeer.com/message/push`,
        body: `pushkey=${DEER_KEY}&text=${text}&desp=${desp}&type=markdown`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('PushDeer 通知调用API失败😞\n', err);
          } else {
            // 通过返回的result的长度来判断是否成功
            if (
              data.content.result.length !== undefined &&
              data.content.result.length > 0
            ) {
              console.log('PushDeer 发送通知消息成功🎉\n');
            } else {
              console.log(
                `PushDeer 发送通知消息异常😞 ${JSON.stringify(data)}`,
              );
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

function chatNotify(text, desp) {
  return new Promise((resolve) => {
    const { CHAT_URL, CHAT_TOKEN } = push_config;
    if (CHAT_URL && CHAT_TOKEN) {
      // 对消息内容进行 urlencode
      desp = encodeURI(desp);
      const options = {
        url: `${CHAT_URL}${CHAT_TOKEN}`,
        body: `payload={"text":"${text}\n${desp}"}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Chat 发送通知调用API失败😞\n', err);
          } else {
            if (data.success) {
              console.log('Chat 发送通知消息成功🎉\n');
            } else {
              console.log(`Chat 发送通知消息异常 ${JSON.stringify(data)}`);
            }
          }
        } catch (e) {
          $.logErr(e);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}


function barkNotify(text, desp, params = {}) {
  return new Promise((resolve) => {
    let {
      BARK_PUSH,
      BARK_ICON,
      BARK_SOUND,
      BARK_GROUP,
      BARK_LEVEL,
      BARK_ARCHIVE,
      BARK_URL,
    } = push_config;
    
    if (!BARK_PUSH) {
      return resolve();
    }

    // 分割多个设备码
    const deviceKeys = BARK_PUSH.split('#').filter(key => key.trim());
    if (deviceKeys.length === 0) {
      return resolve();
    }

    // 处理所有设备推送
    const pushPromises = deviceKeys.map(deviceKey => {
      let pushUrl = deviceKey.trim();
      // 兼容BARK本地用户只填写设备码的情况
      if (!pushUrl.startsWith('http')) {
        pushUrl = `https://api.day.app/${pushUrl}`;
      }
      
      const options = {
        url: pushUrl,
        json: {
          title: text,
          body: desp,
          icon: BARK_ICON,
          sound: BARK_SOUND,
          group: BARK_GROUP,
          isArchive: BARK_ARCHIVE,
          level: BARK_LEVEL,
          url: BARK_URL,
          ...params,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      
      return new Promise((innerResolve) => {
        $.post(options, (err, resp, data) => {
          try {
            if (err) {
              console.log(`Bark APP 发送通知到 ${pushUrl} 失败😞\n`, err);
            } else {
              if (data.code === 200) {
                console.log(`Bark APP 发送通知到 ${pushUrl} 成功🎉\n`);
              } else {
                console.log(`Bark APP 发送通知到 ${pushUrl} 异常 ${data.message}\n`);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            innerResolve();
          }
        });
      });
    });

    // 等待所有推送完成
    Promise.all(pushPromises).then(resolve);
  });
}

function tgBotNotify(text, desp) {
  return new Promise((resolve) => {
    const {
      TG_BOT_TOKEN,
      TG_USER_ID,
      TG_PROXY_HOST,
      TG_PROXY_PORT,
      TG_API_HOST,
      TG_PROXY_AUTH,
    } = push_config;
    if (TG_BOT_TOKEN && TG_USER_ID) {
      const options = {
        url: `${TG_API_HOST}/bot${TG_BOT_TOKEN}/sendMessage`,
        json: {
          chat_id: `${TG_USER_ID}`,
          text: `${text}\n\n${desp}`,
          disable_web_page_preview: true,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      if (TG_PROXY_HOST && TG_PROXY_PORT) {
        const { HttpProxyAgent, HttpsProxyAgent } = require('hpagent');
        const options = {
          keepAlive: true,
          keepAliveMsecs: 1000,
          maxSockets: 256,
          maxFreeSockets: 256,
          proxy: `http://${TG_PROXY_AUTH}${TG_PROXY_HOST}:${TG_PROXY_PORT}`,
        };
        const httpAgent = new HttpProxyAgent(options);
        const httpsAgent = new HttpsProxyAgent(options);
        const agent = {
          http: httpAgent,
          https: httpsAgent,
        };
        Object.assign(options, { agent });
      }
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Telegram 发送通知消息失败😞\n', err);
          } else {
            if (data.ok) {
              console.log('Telegram 发送通知消息成功🎉。\n');
            } else if (data.error_code === 400) {
              console.log(
                '请主动给bot发送一条消息并检查接收用户ID是否正确。\n',
              );
            } else if (data.error_code === 401) {
              console.log('Telegram bot token 填写错误。\n');
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}
function ddBotNotify(text, desp) {
  return new Promise((resolve) => {
    const { DD_BOT_TOKEN, DD_BOT_SECRET } = push_config;
    const options = {
      url: `https://oapi.dingtalk.com/robot/send?access_token=${DD_BOT_TOKEN}`,
      json: {
        msgtype: 'text',
        text: {
          content: `${text}\n\n${desp}`,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout,
    };
    if (DD_BOT_TOKEN && DD_BOT_SECRET) {
      const crypto = require('crypto');
      const dateNow = Date.now();
      const hmac = crypto.createHmac('sha256', DD_BOT_SECRET);
      hmac.update(`${dateNow}\n${DD_BOT_SECRET}`);
      const result = encodeURIComponent(hmac.digest('base64'));
      options.url = `${options.url}&timestamp=${dateNow}&sign=${result}`;
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('钉钉发送通知消息失败😞\n', err);
          } else {
            if (data.errcode === 0) {
              console.log('钉钉发送通知消息成功🎉\n');
            } else {
              console.log(`钉钉发送通知消息异常 ${data.errmsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else if (DD_BOT_TOKEN) {
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('钉钉发送通知消息失败😞\n', err);
          } else {
            if (data.errcode === 0) {
              console.log('钉钉发送通知消息成功🎉\n');
            } else {
              console.log(`钉钉发送通知消息异常 ${data.errmsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

// WxPusher 推送函数
function wxPusherNotify(text, desp) {
  return new Promise((resolve) => {
    const {WX_pusher_appToken,WX_pusher_topicIds} =
      push_config;
  
    const options = {
      url: `https://wxpusher.zjiecode.com/api/send/message`,
      json: {
        appToken: WX_pusher_appToken,
        content: desp,
        summary: text.substring(0, 90),
        contentType: 2, // 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签，推荐使用这种) 3表示markdown 
        topicIds: [WX_pusher_topicIds] // 推送给指定的群组
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout,
    };
    
    if (WX_pusher_appToken) {
    $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('WxPusher发送通知消息失败😞\n', err);
          } else {
            if (data.code === 1000) {
              console.log('WxPusher发送通知消息成功🎉。\n');
            } else {
              console.log(`WxPusher发送通知消息异常\n`);
              console.log(data);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
    });

  }else {
      resolve();
    }
  });
}



// 息知 推送函数
function wxXiZhiNotify(text, desp) {
  return new Promise((resolve) => {
    const {WX_XIZHI_KEY} =
      push_config;
  
    const options = {
      url: WX_XIZHI_KEY,
      json: {
        title: text,
        content: desp
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout,
    };
    
    if (WX_XIZHI_KEY) {
    $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('息知发送通知消息失败😞\n', err);
          } else {
            if (data.code === 200) {
              console.log('息知发送通知消息成功🎉。\n');
            } else {
              console.log(`息知发送通知消息异常 \n`);
              console.log(data);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
    });

  }else {
      resolve();
    }
  });
}

// MeoW 推送函数（支持多设备）
function meoWNotify(text, desp, params = {}) {
  return new Promise((resolve) => {
    const { MeoW_USER } = push_config;
    
    if (!MeoW_USER) {
      return resolve();
    }

    // 分割多个用户ID
    const userIds = MeoW_USER.split('#').filter(id => id.trim());
    if (userIds.length === 0) {
      return resolve();
    }

    // 处理所有用户推送
    const pushPromises = userIds.map(userId => {
      const trimmedId = userId.trim();
      const options = {
        url: `http://api.chuckfang.com/${trimmedId}/`,
        json: {
          title: text,
          msg: desp,
          ...params,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      
      return new Promise((innerResolve) => {
        $.post(options, (err, resp, data) => {
          try {
            if (err) {
              console.log(`MeoW 发送通知到用户 ${trimmedId} 失败😞\n`, err);
            } else {
              if (data.status === 200) {
                console.log(`MeoW 发送通知到用户 ${trimmedId} 成功🎉\n`);
              } else {
                console.log(`MeoW 发送通知到用户 ${trimmedId} 异常\n`);
                console.log(data);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            innerResolve(data);
          }
        });
      });
    });

    // 等待所有推送完成
    Promise.all(pushPromises).then(resolve);
  });
}



function qywxBotNotify(text, desp) {
  return new Promise((resolve) => {
    const { QYWX_ORIGIN, QYWX_KEY } = push_config;
    const options = {
      url: `${QYWX_ORIGIN}/cgi-bin/webhook/send?key=${QYWX_KEY}`,
      json: {
        msgtype: 'text',
        text: {
          content: `${text}\n\n${desp}`,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout,
    };
    if (QYWX_KEY) {
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('企业微信发送通知消息失败😞\n', err);
          } else {
            if (data.errcode === 0) {
              console.log('企业微信发送通知消息成功🎉。\n');
            } else {
              console.log(`企业微信发送通知消息异常 ${data.errmsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}



// 消息类型配置
const API_ENDPOINTS = {
    yy: 'cgi-bin/message/send',      // 内部应用消息
    jx: 'cgi-bin/externalcontact/message/send' // 外部客户消息
};

// 缓存目录
const CACHE_DIR = path.join(__dirname, 'xianbaoku_cache');

// 创建缓存目录
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * 获取缓存文件路径
 */
function getCacheFilePath(corpid, agentid) {
    const safeCorpid = corpid.replace(/[^a-zA-Z0-9]/g, '_');
    const safeAgentid = agentid.replace(/[^a-zA-Z0-9]/g, '_');
    return path.join(CACHE_DIR, `token_${safeCorpid}_${safeAgentid}.json`);
}

/**
 * 获取access_token
 */
async function getAccessToken(corpid, agentid, corpsecret) {
    const {QYWX_ORIGIN,QYWX_AM } = push_config;
    const cacheFile = getCacheFilePath(corpid, agentid);
    const cacheKey = `${corpid}|${agentid}`;

    // 读取缓存
    let cachedToken = { token: '', expiresTime: 0 };
    try {
        if (fs.existsSync(cacheFile)) {
            cachedToken = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
            if (cachedToken.token && Date.now() < cachedToken.expiresTime) {
                console.log(`[${cacheKey}] 使用缓存token`);
                return cachedToken.token;
            }
        }
    } catch (e) {
        console.log(`[${cacheKey}] 缓存读取失败`, e.message);
    }

    // 获取新token
    try {
        console.log(`[${cacheKey}] 正在获取新token...`);
        const { body } = await got.post(`${QYWX_ORIGIN}/cgi-bin/gettoken`, {
            json: { corpid, corpsecret },
            responseType: 'json',
            timeout: 10000
        });

        if (body.errcode) {
            throw new Error(`${body.errcode}: ${body.errmsg}`);
        }

        // 更新缓存（提前5分钟过期）
        const expiresIn = body.expires_in ? Math.max(body.expires_in - 300, 60) : 7100;
        const newToken = {
            token: body.access_token,
            expiresTime: Date.now() + expiresIn * 1000
        };

        fs.writeFileSync(cacheFile, JSON.stringify(newToken), 'utf-8');
        console.log(`[${cacheKey}] token更新成功，有效期${expiresIn}秒`);
        return newToken.token;
    } catch (error) {
        console.error(`[${cacheKey}] 获取token失败:`, error.message);
        if (cachedToken.token && Date.now() < cachedToken.expiresTime + 300000) {
            console.log(`[${cacheKey}] 尝试使用即将过期的缓存token`);
            return cachedToken.token;
        }
        throw error;
    }
}

/**
 * 发送消息到指定应用
 */
async function sendToApp(text, desp, appConfig) {
    const {QYWX_ORIGIN,QYWX_AM } = push_config;
    const [corpid, agentid, corpsecret, type = 'yy'] = appConfig.split(',');
    const cacheKey = `${corpid}|${agentid}`;
    const endpoint = API_ENDPOINTS[type] || API_ENDPOINTS.yy;

    if (!API_ENDPOINTS[type]) {
        console.log(`[${cacheKey}] ❌ 无效的消息类型: ${type}，默认使用yy`);
    }

    try {
        const access_token = await getAccessToken(corpid, agentid, corpsecret);

        const { body } = await got.post(
            `${QYWX_ORIGIN}/${endpoint}?access_token=${access_token}`,
            {
                json: {
                    touser: '@all',
                    agentid,
                    msgtype: 'text',
                    text: { content: `${text}\n\n${desp}` },
                    safe: 0
                },
                responseType: 'json',
                timeout: 10000
            }
        );

        // Token失效处理
        if (body.errcode === 40001 || body.errcode === 42001) {
            console.log(`[${cacheKey}] token已失效，清除缓存重试...`);
            fs.unlinkSync(getCacheFilePath(corpid, agentid));
            return await sendToApp(text, desp, appConfig);
        }

        if (body.errcode === 0) {
            console.log(`[${cacheKey}] ✅ 消息发送成功 (${type})`);
            return true;
        } else {
            console.log(`[${cacheKey}] ❌ 发送失败: ${body.errmsg} (${type})`);
            return false;
        }
    } catch (error) {
        console.error(`[${cacheKey}] ❌ 发送出错:`, error.message);
        return false;
    }
}

/**
 * 发送消息到所有配置的应用
 */
async function qywxamNotify(text, desp) {
    const {QYWX_ORIGIN,QYWX_AM } = push_config;
    if (!QYWX_AM) {
        return false;
    }

    console.log('企业微信推送开始：');
    const apps = QYWX_AM.split('#').filter(x => x.trim());
    if (apps.length === 0) {
        console.log('❌ 未配置有效的企业微信应用');
        return false;
    }

    let allSuccess = true;
    for (const app of apps) {
        const appConfig = app.split(',');
        if (appConfig.length < 3) {
            console.log(`❌ 无效配置项: ${app}`);
            allSuccess = false;
            continue;
        }
        
        const success = await sendToApp(text, desp, app);
        if (!success) allSuccess = false;
    }

    return allSuccess;
}




function iGotNotify(text, desp, params = {}) {
  return new Promise((resolve) => {
    const { IGOT_PUSH_KEY } = push_config;
    if (IGOT_PUSH_KEY) {
      // 校验传入的IGOT_PUSH_KEY是否有效
      const IGOT_PUSH_KEY_REGX = new RegExp('^[a-zA-Z0-9]{24}$');
      if (!IGOT_PUSH_KEY_REGX.test(IGOT_PUSH_KEY)) {
        console.log('您所提供的 IGOT_PUSH_KEY 无效\n');
        resolve();
        return;
      }
      const options = {
        url: `https://push.hellyw.com/${IGOT_PUSH_KEY.toLowerCase()}`,
        body: `title=${text}&content=${desp}&${querystring.stringify(params)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('IGot 发送通知调用API失败😞\n', err);
          } else {
            if (data.ret === 0) {
              console.log('IGot 发送通知消息成功🎉\n');
            } else {
              console.log(`IGot 发送通知消息异常 ${data.errMsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

function pushPlusNotify(text, desp) {
  return new Promise((resolve) => {
    const { PUSH_PLUS_TOKEN, PUSH_PLUS_USER } = push_config;
    if (PUSH_PLUS_TOKEN) {
      desp = desp.replace(/[\n\r]/g, '<br>'); // 默认为html, 不支持plaintext
      const body = {
        token: `${PUSH_PLUS_TOKEN}`,
        title: `${text}`,
        content: `${desp}`,
        topic: `${PUSH_PLUS_USER}`,
      };
      const options = {
        url: `https://www.pushplus.plus/send`,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': ' application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log(
              `Push+ 发送${
                PUSH_PLUS_USER ? '一对多' : '一对一'
              }通知消息失败😞\n`,
              err,
            );
          } else {
            if (data.code === 200) {
              console.log(
                `Push+ 发送${
                  PUSH_PLUS_USER ? '一对多' : '一对一'
                }通知消息完成🎉\n`,
              );
            } else {
              console.log(
                `Push+ 发送${
                  PUSH_PLUS_USER ? '一对多' : '一对一'
                }通知消息异常 ${data.msg}\n`,
              );
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

function wePlusBotNotify(text, desp) {
  return new Promise((resolve) => {
    const { WE_PLUS_BOT_TOKEN, WE_PLUS_BOT_RECEIVER, WE_PLUS_BOT_VERSION } =
      push_config;
    if (WE_PLUS_BOT_TOKEN) {
      const template = 'txt';
      if (desp.length > 800) {
        desp = desp.replace(/[\n\r]/g, '<br>');
        template = 'html';
      }
      const body = {
        token: `${WE_PLUS_BOT_TOKEN}`,
        title: `${text}`,
        content: `${desp}`,
        template: `${template}`,
        receiver: `${WE_PLUS_BOT_RECEIVER}`,
        version: `${WE_PLUS_BOT_VERSION}`,
      };
      const options = {
        url: `https://www.weplusbot.com/send`,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': ' application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log(`微加机器人发送通知消息失败😞\n`, err);
          } else {
            if (data.code === 200) {
              console.log(`微加机器人发送通知消息完成🎉\n`);
            } else {
              console.log(`微加机器人发送通知消息异常 ${data.msg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

function aibotkNotify(text, desp) {
  return new Promise((resolve) => {
    const { AIBOTK_KEY, AIBOTK_TYPE, AIBOTK_NAME } = push_config;
    if (AIBOTK_KEY && AIBOTK_TYPE && AIBOTK_NAME) {
      let json = {};
      let url = '';
      switch (AIBOTK_TYPE) {
        case 'room':
          url = 'https://api-bot.aibotk.com/openapi/v1/chat/room';
          json = {
            apiKey: `${AIBOTK_KEY}`,
            roomName: `${AIBOTK_NAME}`,
            message: {
              type: 1,
              content: `【青龙快讯】\n\n${text}\n${desp}`,
            },
          };
          break;
        case 'contact':
          url = 'https://api-bot.aibotk.com/openapi/v1/chat/contact';
          json = {
            apiKey: `${AIBOTK_KEY}`,
            name: `${AIBOTK_NAME}`,
            message: {
              type: 1,
              content: `【青龙快讯】\n\n${text}\n${desp}`,
            },
          };
          break;
      }
      const options = {
        url: url,
        json,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('智能微秘书发送通知消息失败😞\n', err);
          } else {
            if (data.code === 0) {
              console.log('智能微秘书发送通知消息成功🎉。\n');
            } else {
              console.log(`智能微秘书发送通知消息异常 ${data.error}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

function fsBotNotify(text, desp) {
  return new Promise((resolve) => {
    const { FSKEY } = push_config;
    if (FSKEY) {
      const options = {
        url: `https://open.feishu.cn/open-apis/bot/v2/hook/${FSKEY}`,
        json: { msg_type: 'text', content: { text: `${text}\n\n${desp}` } },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('飞书发送通知调用API失败😞\n', err);
          } else {
            if (data.StatusCode === 0 || data.code === 0) {
              console.log('飞书发送通知消息成功🎉\n');
            } else {
              console.log(`飞书发送通知消息异常 ${data.msg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

async function smtpNotify(text, desp) {
  const { SMTP_EMAIL, SMTP_PASSWORD, SMTP_SERVICE, SMTP_NAME } = push_config;
  if (![SMTP_EMAIL, SMTP_PASSWORD].every(Boolean) || !SMTP_SERVICE) {
    return;
  }

  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: SMTP_SERVICE,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const addr = SMTP_NAME ? `"${SMTP_NAME}" <${SMTP_EMAIL}>` : SMTP_EMAIL;
    const info = await transporter.sendMail({
      from: addr,
      to: addr,
      subject: text,
      html: `${desp.replace(/\n/g, '<br/>')}`,
    });

    transporter.close();

    if (info.messageId) {
      console.log('SMTP 发送通知消息成功🎉\n');
      return true;
    }
    console.log('SMTP 发送通知消息失败😞\n');
  } catch (e) {
    console.log('SMTP 发送通知消息出现异常😞\n', e);
  }
}


function pushMeNotify(text, desp, params = {}) {
  return new Promise((resolve) => {
    const { PUSHME_KEY, PUSHME_URL } = push_config;
    
    if (!PUSHME_KEY) {
      return resolve();
    }

    // 分割多个推送KEY
    const pushKeys = PUSHME_KEY.split('#').filter(key => key.trim());
    if (pushKeys.length === 0) {
      return resolve();
    }

    // 处理所有推送请求
    const pushPromises = pushKeys.map(pushKey => {
      const trimmedKey = pushKey.trim();
      const options = {
        url: PUSHME_URL || 'https://push.i-i.me',
        json: { 
          push_key: trimmedKey, 
          title: text, 
          content: desp, 
          type: "markdown", 
          ...params 
        },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      
      return new Promise((innerResolve) => {
        $.post(options, (err, resp, data) => {
          try {
            if (err) {
              console.log(`PushMe 发送通知到 KEY ${trimmedKey} 失败😞\n`, err);
            } else {
              if (data === 'success') {
                console.log(`PushMe 发送通知到 KEY ${trimmedKey} 成功🎉\n`);
              } else {
                console.log(`PushMe 发送通知到 KEY ${trimmedKey} 异常: ${data}\n`);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            innerResolve(data);
          }
        });
      });
    });

    // 等待所有推送完成
    Promise.all(pushPromises).then(resolve);
  });
}

function chronocatNotify(title, desp) {
  return new Promise((resolve) => {
    const { CHRONOCAT_TOKEN, CHRONOCAT_QQ, CHRONOCAT_URL } = push_config;
    if (!CHRONOCAT_TOKEN || !CHRONOCAT_QQ || !CHRONOCAT_URL) {
      resolve();
      return;
    }

    const user_ids = CHRONOCAT_QQ.match(/user_id=(\d+)/g)?.map(
      (match) => match.split('=')[1],
    );
    const group_ids = CHRONOCAT_QQ.match(/group_id=(\d+)/g)?.map(
      (match) => match.split('=')[1],
    );

    const url = `${CHRONOCAT_URL}/api/message/send`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHRONOCAT_TOKEN}`,
    };

    for (const [chat_type, ids] of [
      [1, user_ids],
      [2, group_ids],
    ]) {
      if (!ids) {
        continue;
      }
      for (const chat_id of ids) {
        const data = {
          peer: {
            chatType: chat_type,
            peerUin: chat_id,
          },
          elements: [
            {
              elementType: 1,
              textElement: {
                content: `${title}\n\n${desp}`,
              },
            },
          ],
        };
        const options = {
          url: url,
          json: data,
          headers,
          timeout,
        };
        $.post(options, (err, resp, data) => {
          try {
            if (err) {
              console.log('Chronocat 发送QQ通知消息失败😞\n', err);
            } else {
              if (chat_type === 1) {
                console.log(`Chronocat 个人消息 ${ids}推送成功🎉`);
              } else {
                console.log(`Chronocat 群消息 ${ids}推送成功🎉`);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve(data);
          }
        });
      }
    }
  });
}

function qmsgNotify(text, desp) {
  return new Promise((resolve) => {
    const { QMSG_KEY, QMSG_TYPE } = push_config;
    if (QMSG_KEY && QMSG_TYPE) {
      const options = {
        url: `https://qmsg.zendee.cn/${QMSG_TYPE}/${QMSG_KEY}`,
        body: `msg=${text}\n\n${desp.replace('----', '-')}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Qmsg 发送通知调用API失败😞\n', err);
          } else {
            if (data.code === 0) {
              console.log('Qmsg 发送通知消息成功🎉\n');
            } else {
              console.log(`Qmsg 发送通知消息异常 ${data}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

function webhookNotify(text, desp) {
  return new Promise((resolve) => {
    const {
      WEBHOOK_URL,
      WEBHOOK_BODY,
      WEBHOOK_HEADERS,
      WEBHOOK_CONTENT_TYPE,
      WEBHOOK_METHOD,
    } = push_config;
    if (!WEBHOOK_URL.includes('$title') && !WEBHOOK_BODY.includes('$title')) {
      resolve();
      return;
    }

    const headers = parseHeaders(WEBHOOK_HEADERS);
    const body = parseBody(WEBHOOK_BODY, WEBHOOK_CONTENT_TYPE, (v) =>
      v?.replaceAll('$title', text)?.replaceAll('$content', desp),
    );
    const bodyParam = formatBodyFun(WEBHOOK_CONTENT_TYPE, body);
    const options = {
      method: WEBHOOK_METHOD,
      headers,
      allowGetBody: true,
      ...bodyParam,
      timeout,
      retry: 1,
    };

    if (WEBHOOK_METHOD) {
      const formatUrl = WEBHOOK_URL.replaceAll(
        '$title',
        encodeURIComponent(text),
      ).replaceAll('$content', encodeURIComponent(desp));
      got(formatUrl, options).then((resp) => {
        try {
          if (resp.statusCode !== 200) {
            console.log(`自定义发送通知消息失败😞 ${resp.body}\n`);
          } else {
            console.log(`自定义发送通知消息成功🎉 ${resp.body}\n`);
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(resp.body);
        }
      });
    } else {
      resolve();
    }
  });
}

function parseString(input, valueFormatFn) {
  const regex = /(\w+):\s*((?:(?!\n\w+:).)*)/g;
  const matches = {};

  let match;
  while ((match = regex.exec(input)) !== null) {
    const [, key, value] = match;
    const _key = key.trim();
    if (!_key || matches[_key]) {
      continue;
    }

    let _value = value.trim();

    try {
      _value = valueFormatFn ? valueFormatFn(_value) : _value;
      const jsonValue = JSON.parse(_value);
      matches[_key] = jsonValue;
    } catch (error) {
      matches[_key] = _value;
    }
  }

  return matches;
}

function parseHeaders(headers) {
  if (!headers) return {};

  const parsed = {};
  let key;
  let val;
  let i;

  headers &&
    headers.split('\n').forEach(function parser(line) {
      i = line.indexOf(':');
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();

      if (!key) {
        return;
      }

      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    });

  return parsed;
}

function parseBody(body, contentType, valueFormatFn) {
  if (contentType === 'text/plain' || !body) {
    return valueFormatFn && body ? valueFormatFn(body) : body;
  }

  const parsed = parseString(body, valueFormatFn);

  switch (contentType) {
    case 'multipart/form-data':
      return Object.keys(parsed).reduce((p, c) => {
        p.append(c, parsed[c]);
        return p;
      }, new FormData());
    case 'application/x-www-form-urlencoded':
      return Object.keys(parsed).reduce((p, c) => {
        return p ? `${p}&${c}=${parsed[c]}` : `${c}=${parsed[c]}`;
      });
  }

  return parsed;
}

function formatBodyFun(contentType, body) {
  if (!body) return {};
  switch (contentType) {
    case 'application/json':
      return { json: body };
    case 'multipart/form-data':
      return { form: body };
    case 'application/x-www-form-urlencoded':
    case 'text/plain':
      return { body };
  }
  return {};
}

/**
 * sendNotify 推送通知功能
 * @param text 通知头
 * @param desp 通知体
 * @param params 某些推送通知方式点击弹窗可跳转, 例：{ url: 'https://abc.com' }
 * @returns {Promise<unknown>}
 */
async function sendNotify(text, desp, params = {}) {
  // 根据标题跳过一些消息推送，环境变量：SKIP_PUSH_TITLE 用回车分隔
  let skipTitle = process.env.SKIP_PUSH_TITLE;
  if (skipTitle) {
    if (skipTitle.split('\n').includes(text)) {
      console.info(text + '在 SKIP_PUSH_TITLE 环境变量内，跳过推送');
      return;
    }
  }

  if (push_config.HITOKOTO !== 'false') {
    desp += '\n\n' + (await one());
  }

  await Promise.all([
    serverNotify(text, desp), // 微信server酱
    pushPlusNotify(text, desp), // pushplus
    wePlusBotNotify(text, desp), // 微加机器人
    barkNotify(text, desp, params), // iOS Bark APP
    tgBotNotify(text, desp), // telegram 机器人
    ddBotNotify(text, desp), // 钉钉机器人
    wxPusherNotify(text, desp), //wxpusher 推送
    wxXiZhiNotify(text, desp), //息知推送
    meoWNotify(text, desp),//MeoW推送
    qywxBotNotify(text, desp), // 企业微信机器人
    qywxamNotify(text, desp), // 企业微信应用消息推送
    iGotNotify(text, desp, params), // iGot
    gobotNotify(text, desp), // go-cqhttp
    gotifyNotify(text, desp), // gotify
    chatNotify(text, desp), // synolog chat
    pushDeerNotify(text, desp), // PushDeer
    aibotkNotify(text, desp), // 智能微秘书
    fsBotNotify(text, desp), // 飞书机器人
    smtpNotify(text, desp), // SMTP 邮件
    pushMeNotify(text, desp, params), // PushMe
    chronocatNotify(text, desp), // Chronocat
    webhookNotify(text, desp), // 自定义通知
    qmsgNotify(text, desp), // 自定义通知
  ]);
}

module.exports = {
  sendNotify,serverNotify,pushPlusNotify,wePlusBotNotify,barkNotify,tgBotNotify,ddBotNotify,wxPusherNotify,wxXiZhiNotify,meoWNotify,qywxBotNotify,qywxamNotify,iGotNotify,gobotNotify,gotifyNotify,chatNotify,pushDeerNotify,aibotkNotify,fsBotNotify,smtpNotify,pushMeNotify,chronocatNotify,webhookNotify,qmsgNotify
};
