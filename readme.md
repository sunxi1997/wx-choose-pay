# 使用场景

如果您在开发微信公众号网页的网页支付,这里的内容可能会对你有所帮助

阅读官方文档可能会让你了解到更多:

[微信网页开发-JS-SDK说明](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115) 

[微信支付JSAPI支付开发步骤](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_3)

[微信网页授权](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842)

阅读此文档时默认您已对接好微信登录授权,若你还没有做好微信登录,请参考上面官方文档:微信网页授权

# 使用步骤

## 1 公众号后台配置

### 1.1 绑定JS安全域名

   ***微信公众平台 -> 公众号设置 -> 功能设置 -> JS接口安全域名***
   
   登录后可在“开发者中心”查看是否具有支付接口的调用权限,支付需要公众号性质为服务号并且已认证!

### 1.2 设置支付目录
   
   ***微信商户平台 -> 产品中心 -> 开发配置 -> 支付配置***

请确保实际支付时的请求目录与后台配置的目录一致（现在已经支持配置根目录，配置后有一定的生效时间，一般5分钟内生效），否则将无法成功唤起微信支付。

在**微信商户平台**（pay.weixin.qq.com）设置您的JSAPI支付支付目录，设置路径：商户平台-->产品中心-->开发配置，如图所示。JSAPI支付在请求支付的时候会校验请求来源是否有在商户平台做了配置，所以必须确保支付目录已经正确的被配置，否则将验证失败，请求支付不成功。
![支付配置](https://pay.weixin.qq.com/wiki/doc/api/img/chapter7_3_1.png)


## 2 引入文件

    npm install wx-choose-pay
    
或者直接下载index.js,在自己的项目中使用script引入;


## 3 使用

要先初始化微信JS-SDK,并注入验证参数,然后再调用支付;
如果你已经使用了微信JS-SDK,请直接看3.2步骤

### 3.1 当前页面未注入微信JS-SDK权限验证

如果你尚未引入微信 JS-SDK,请先参考代码注入验证,参数来源请参考 [微信JSSDK附录1-JS-SDK使用权限签名算法(点击查看)](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115#62)
后端人员会把生成好的参数给你,如果你的页面地址发生变化,要重新注入权限验证

**注意**此签名配置与支付的签名是两回事,先注入JS-SDK权限,然后才能调用微信支付API,注入微信支付签名参数

支付参数备注:prepay_id 通过微信支付统一下单接口拿到，paySign 采用统一的微信支付 Sign 签名生成方法，注意这里 appId 也要参与签名，appId 与 config 中传入的 appId 一致，即最后参与签名的参数有appId, timeStamp, nonceStr, package, signType。
具体生成方法参考顶部微信支付文档

```
import {initWxJSSDK,chooseWxPay} from 'wx-choose-pay'

let config = {
  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: '', // 必填，公众号的唯一标识
  timestamp: '', // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名
  jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
}

//初始化JS-SDK
initWxJSSDK(config).then(function(){
    //支付参数
    let payment = {
        timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: '', // 支付签名随机串，不长于 32 位
        package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: '', // 支付签名
    }
    //发起微信支付
    wx.choosePay(payment).then(res=>{
        console.log('支付成功',res);    
    },err=>{
        console.log('支付失败',err);
    })
})
```

### 3.2 当前页面已注入过微信JS-SDK权限验证

```
import {chooseWxPay} from 'wx-choose-pay'

    //支付参数
    let payment = {
        timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: '', // 支付签名随机串，不长于 32 位
        package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: '', // 支付签名
    }
     //发起微信支付
     wx.choosePay(payment).then(res=>{
         console.log('支付成功',res);    
     },err=>{
         console.log('支付失败',err);
     })

```

### 特别提醒:
支付参数中的package中一般使用后端从统一支付接口获取到的prepay_id;假设prepay_id为a1b2c3;提交时package的值应为package:'prepay_id=a1b2c3';
如果是package:'a1b2c3';会返回失败!!!

## 4 API

 api  | 参数  | 返回值 |  说明 
 ---- | ----- | ------  | ------  
 createWxJSSDK  | 无 | Promise | 引入微信JS-SDK  
 initWxJSSDK  | JSSDKConfig | Promise | 内部调用createWxJSSDK并注入权限验证  
 chooseWxPay  | wxPayment | Promise | 发起微信支付
   
#### JSSDKConfig   

 key  | 类型  | 说明 
 ---- | ------  | ------  
 debug  | Boolean   | 开启调试模式,调用的所有api的返回值会在客户端alert出来， 若要查看传入的参数，可以在pc端打开， 参数信息会通过log打出，仅在pc端时才会打印。  
 appId  | String   | 必填，公众号的唯一标识 
 timestamp  | String Number   | 必填，生成签名的时间戳  
 nonceStr  | String  | 必填，生成签名的随机串
 signature  | String  | 必填，签名
 jsApiList  | Array[String]  | 必填，需要使用的JS接口列表, 如果只使用微信支付,填['wxChoosePay']
    
#### wxPayment   

 key  | 类型  |  说明 
 ---- | ------  | ------  
 timestamp  | String   | 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。 但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
 nonceStr  | String  |  支付签名随机串，不长于 32 位
 package  | String  | 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
 signType  | String  | 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
 paySign  | String  | 支付签名
 
### createWxJSSDK

````
createWxJSSDK().then(()=>{
    console.log(wx);
    console.log('wx is ready');//wx-JS-SDK已经引入成功
})

````
 
### initWxJSSDK

````
let config = {
  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: '', // 必填，公众号的唯一标识
  timestamp: '', // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名
  jsApiList: [''] // 必填，需要使用的JS接口列表
}

//初始化JS-SDK
initWxJSSDK(config).then(()=>{
    /*初始化完成,config的jsApiList中注入的api已经可以调用*/
    console.log('init ok');
},()=>{
    /*注入失败,大概率是签名验证不通过,可能是后台配置不正确或者后端生成签名时的url与当前页面url不一致*/
})


````
### chooseWxPay

````
//支付参数
let payment = {
    timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    nonceStr: '', // 支付签名随机串，不长于 32 位
    package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
    signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    paySign: '', // 支付签名
}
//发起微信支付
wx.choosePay(payment).then(res=>{
    /*如果真机调试时支付界面一闪消失掉,没有成功发起支付,大概率是商家后端支付接口没有配置好,查看顶部 微信支付JSAPI支付开发步骤 文档,配置JSAPI支付路径*/
    console.log('支付结果',res);  
},err=>{
    console.log('失败',err);
})

````


# 最后

简单来讲,微信授权后,后端获取到access_token等,然后再获取jsapi_ticket,给前端生成JS-SDK的注入权限签名;

在需要支付的时候,后端再生成对应的支付参数,前端用这些参数直接发起支付就可以了;

就是说参数怎么获得是后端老哥要考虑的事情,建议多看顶部的官方文档

最后要注意:页面url发生变化,都要重新注入权限验证,哪怕是spa的页面变化,也一样

最后的最后:这个JS-SDK的验证特别麻烦,建议使用微信内置浏览器自带API发起微信支付; [WeixinJSBridge](http://github.com/sunxi1997/wx-pay)
