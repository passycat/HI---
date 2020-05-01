let fileID = ""
Page({
    data: {
        imgPath: "/images/yuna.png",
        lableList: []
    },

    //上传图片
    selectImg: function() {
        wx.chooseImage({
          count: 1,
          success: (res) => {
              this.setData({
                  imgPath: res.tempFilePaths[0],
                  lableList: []
              })
          }
        })
    },

    //上传图片并处理
    uploadImg: function () {
        const filePath = this.data.imgPath
        console.log(filePath)
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        console.log(cloudPath)
        wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: filePath
        })
        .then((res) => {
            console.log(res)
            fileID = res.fileID
            wx.cloud.callFunction({
                name: "trialImage",
                data: {
                    imgPath: res.fileID
                }
            })
            .then((res) => {
                console.log(res)
                const { result: { PoliticsInfo = {}, PornInfo = {}, TerroristInfo = {} } } = res
                if (PoliticsInfo.Code === 0 && PornInfo.Code === 0 && TerroristInfo.Code === 0) {
                    //图片标签处理
                    wx.cloud.callFunction({
                        name: "ImgLables",
                        data: {
                            imgPath: fileID
                        }
                    })
                    .then((res) => {
                        const {result: {data: {RecognitionResult: {Labels = {}}}}} = res
                        console.log(res)
                        console.log(Labels)
                        var tempLable = []
                        for (var i in Labels) {
                            tempLable.push(Labels[i].Name)
                        }
                        this.setData({
                            imgPath: fileID,
                            lableList: tempLable
                        })
                    })
                }
            })
            .catch((res) => {
                console.log("图片审查失败：" + res)
            })
        })
        .catch((res) => {
            console.log("上传失败：" + res)
        })
    },


})