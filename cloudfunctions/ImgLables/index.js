// 云函数入口文件
const cloud = require('wx-server-sdk')
const extCi = require("@cloudbase/extension-ci");
const tcb = require("tcb-admin-node");
tcb.init({
  env: 'moggycat-m5hfj'
  });

tcb.registerExtension(extCi);
cloud.init()

//标签处理函数
async function lables(cloudPath) {
    try {
      const res = await tcb.invokeExtension("CloudInfinite", {
        action: "DetectLabel",
        cloudPath: cloudPath // 需要分析的图像的绝对路径，与tcb.uploadFile中一致
      });
      
      return res
    } catch (err) {
      
      return "" + err
    }
}


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    //云储存图片路劲
    let imgPath = 'my-image' + event.imgPath.match(/\.[^.]+?$/)[0]
    return lables(imgPath)
}