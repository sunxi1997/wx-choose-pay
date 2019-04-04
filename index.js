
/**
 * @param payment 类型:Object
 */
function chooseWxPay(payment) {
    return new Promise((resolve, reject) => {
        let wx = window['wx'];
        /*先初始化微信JS-SDK,才能使用微信支付*/
        if(!wx){
            reject('wx is undefined! please initWxJSSDK')
            return;
        }
        /*支付参数是个对象*/
        if (typeof payment !== 'object') {
            reject('payment must be a object!');
            return;
        }
        payment.success = resolve;
        payment.fail = reject;
        // console.log('wx chooseWxPay', payment);
        wx.chooseWXPay(payment)
    })
}


function createWxJSSDK() {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.src = 'http://res.wx.qq.com/open/js/jweixin-1.4.0.js';
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script)
    })
}

function initWxJSSDK(config) {
    return new Promise((resolve, reject) => {
        createWxJSSDK().then(() => {
            let wx = window.wx;
            wx.config(config);
            wx.ready(function () {
                resolve();
            })
// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            wx.error(function (res) {
                reject(res);
            });
        })
    })
}

export {createWxJSSDK,initWxJSSDK,chooseWxPay}