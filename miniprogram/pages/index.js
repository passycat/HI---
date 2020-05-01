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
        wx.showLoading({
          title: '上传图片中',
        })
        wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: filePath
        })
        .then((res) => {
            wx.hideLoading({
              complete: (res) => {},
            })
            wx.showLoading({
              title: '图片审查中',
            })
            console.log(res)
            fileID = res.fileID
            //图片安全审查
            wx.cloud.callFunction({
                name: "trialImage",
                data: {
                    imgPath: res.fileID
                }
            })
            .then((res) => {
                wx.hideLoading({
                    complete: (res) => {},
                })
                wx.showLoading({
                    title: '获取标签',
                })
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
                        wx.hideLoading({
                            complete: (res) => {},
                        })
                        wx.showToast({
                          title: '处理完成',
                        })
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
                    .catch((res) => {
                        console.log("图片获取标签失败：" + res)
                        wx.hideLoading({
                            complete: (res) => {},
                          })
                          wx.showLoading({
                            title: '取标签失败',
                            icon: "none"
                          })
                    })
                }
            })
            .catch((res) => {
                console.log("图片审查失败：" + res)
                wx.hideLoading({
                    complete: (res) => {},
                  })
                  wx.showLoading({
                    title: '审查失败',
                    icon: "none"
                  })
            })
        })
        .catch((res) => {
            wx.hideLoading({
              complete: (res) => {},
            })
            wx.showLoading({
              title: '上传失败',
              icon: "none"
            })
            console.log("上传失败：" + res)
        })
    },


})