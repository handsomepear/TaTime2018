var indexPage = {
  data: {
    userInfo: {},
    canShowPageNum: 0,
    from: 'default',
    jcnuserId: ''
  },
  init: function () {
    this.data.from = TOOLS._getQueryString('from') || 'default'
    if (this.data.from === 'share') {
      this.data.userInfo = decodeURIComponent(JSON.parse(shareUserInfo))
      this.data.jcnuserId = TOOLS._getQueryString('shareJcnuserId')
    }
    if (this.data.from === 'default') {
      this.data.jcnuserId = TOOLS._getQueryString('jcnuserid')
      this.getUserInfo()
    }
    this.getYearUserInfoFor2018()
    this.addEvents()
  },

  addEvents: function () {
    var that = this
    // 帮助与反馈
    var $container = $('#container')
    $container.on('click', '.feedback-btn', function () {
      window.location.href = 'jcnhers://customer/imService={hers}'
    })
    // 再看一次
    $container.on('click', '.see-again', function () {
      that.data.swiper.slideTo(0)
    })
    // 分享
    $container.on('click', '.ta-share', function () {
      $('.share-panel').show()
      //分享面板
      var shareData = {
        typeId: '',
        itemId: '',
        isShareImg: false,
        shareImage: '',
        shareTitle: '2018她社区年度报告',
        shareDesc: '和“她”在一起',
        shareUrl: 'https://bbs.j.cn/pages/tatime/index.html?shareUserInfo=' + JSON.stringify(encodeURIComponent(that.data.userInfo)) +
          '&from=share',
        result: ''
        // native 的 JS 接口朋友圈分享的时候 title 和 desc 相反 需要做一下处理
      }
      var shareCircleData = {
        typeId: '',
        itemId: '',
        isShareImg: false,
        shareImage: '',
        shareTitle: '和“她”在一起',
        shareDesc: '2018她社区年度报告',
        shareUrl: 'https://bbs.j.cn/pages/tatime/index.html?shareUserInfo=' + JSON.stringify(encodeURIComponent(that.data.userInfo)) +
          '&from=share',
        result: ''
      }
      $('.share-channels li').on('click', function () {
        var index = $(this).attr('data-index')
        switch (index) {
          case '0':
            // 朋友圈
            window.app_interface.shareToCircle(JSON.stringify(shareCircleData))
            break
          case '1':
            // 微信好友
            window.app_interface.shareToFriend(JSON.stringify(shareData))
            break
          case '2':
            // qq好友
            window.app_interface.shareToQfriend(JSON.stringify(shareData))
            break
          case '3':
            // QQ空间
            window.app_interface.shareToQzone(JSON.stringify(shareData))
            break
          case '4':
            window.app_interface.shareToWeibo(JSON.stringify(shareData))
            break
          default:
            break
        }
      })
    })
    $('.share-cancel').on('click', function () {
      $('.share-panel').hide()
    })
    $('.share-panel').on('click', function (e) {
      var target = e.target || e.srcElement
      if (target !== this) {
        return false
      }
      $(this).hide()
    })
    // 查看我的2018
    $container.on('click', '.viewmine', function () {
      window.location.href = 'https://bbs.j.cn/pages/tatime/index.html'
    })
  },
  // 获取用户信息
  getUserInfo: function () {
    var that = this
    if (window.app_interface) {
      window.app_interface.getHersUserInfo(function (userInfo) {
        userInfo = JSON.parse(userInfo)
        if (userInfo.id !== 0) {
          that.data.userInfo = userInfo
        }
      })
    }
  },
  // 初始化
  initPage: function (data) {
    this.$swiperWrapper = $('.swiper-wrapper')
    this.initGreetPage()
    this.initCreatePage(data.createTime, data.togetherDays)
    this.initMeetPage(data.openAppCount, data.signDays) // 缺少连续访问次数
    this.initSquarePage(data.groupAndCountList.length, data.groupAndCountList[0].groupName, data.groupAndCountList[0].count, data.sameTopGroups[0].percent *
      100)
    this.initCommentPage(data.sendPostCount, data.replyPostCount, data.sendFlowerCount, data.thumbupCount)
    this.initReceivePage(data.receiveSendFlowerCount, data.receiveReplyPostCount, data.receiveThumbupCount)
    this.initFriendPage(data.ofenInteractiveWithYouHeadUrl, data.ofenInteractiveWithYouUserName, data.ofenInteractiveWithYouCount, data.ofenInteractiveYouToHeadUrl, data.ofenInteractiveYouToUserName, data.ofenInteractiveYouToCount)
    this.initGradePage(data.score, data.attentionCount, '89%')
    this.initPrizePage(data.changeData.changeInfo)
    this.initNightPage(data.midnightSendPostTime)
    this.initPregnancyPage(data.babyGestationDate)
    this.initBirthPage(data.babyBornDate)
    this.initFestivalPage([
      { site: data.locationChunjie, peopleNum: data.locationChunjieAllCount, name: '春节' },
      { site: data.locationQixi, peopleNum: data.locationQixiAllCount, name: '七夕' },
      { site: data.locationGanenjie, peopleNum: data.locationGanenjieAllCount, name: '感恩节' },
      { site: data.locationZhongqiu, peopleNum: data.locationZhongqiuAllCount, name: '中秋' },
      { site: data.locationGuoqing, peopleNum: data.locationGuoqingAllCount, name: '国庆节' }
    ])
    this.initEndPage(this.data.userInfo.headerUrl, this.data.userInfo.nickName, data.tagName, data.tagMemo)
    if (this.data.canShowPageNum < 3) {
      $('.not-found').show()
    } else {
      $('#container').show()
      this.initPageSwiper()
    }
  },
  // 初始化页面swiper
  initPageSwiper: function () {
    this.data.swiper = new Swiper('#container', {
      direction: 'vertical',
      initialSlide: 0,
      // observer: true, //修改swiper自己或子元素时，自动初始化swiper
      // observeParents: true,
      on: {
        init: function () {
        },
        // 切换结束时触发
        slideChangeTransitionEnd: function () {
          // var activeIndex = this.activeIndex
          // 切换成功之后还要恢复上一个页面的样式
        }
      }
    })
  },
  getYearUserInfoFor2018: function () {
    var that = this
    $.ajax({
      type: 'POST',
      url: 'http://bbs.j.cn/api/getYearUserInfoFor2018',
      data: {
        jcnuserid: that.data.jcnuserId
      },
      success: function (data) {
        if (data.errCode === 0) {

          that.initPage(data)
        } else {
          $('.not-found').show()
        }
      }
    })
  },
  initGreetPage: function () {
    var greetPageHtmlStr = '<div class="page-item item1 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <!-- 右上角叶子 -->\n' +
      '        <div class="right-yezi"></div>\n' +
      '        <!-- 标语 -->\n' +
      '        <div class="main-font">\n' +
      '          <img src="./imgs/page1/bg1-font.png" alt="" />\n' +
      '        </div>\n' +
      '        <!-- 女孩 -->\n' +
      '        <div class="girl">\n' +
      '          <div class="girl-left">\n' +
      '            <div class="top">\n' +
      '              <div class="hair"></div>\n' +
      '              <div class="body">\n' +
      '                <img src="./imgs/page1/bg1-left-t.png" alt="">\n' +
      '              </div>\n' +
      '            </div>\n' +
      '            <div class="bottom">\n' +
      '              <img src="./imgs/page1/bg1-left-b.png" alt="">\n' +
      '            </div>\n' +
      '          </div>\n' +
      '          <div class="girl-right">\n' +
      '            <div class="top">\n' +
      '              <div class="hair"></div>\n' +
      '              <div class="body">\n' +
      '                <img src="./imgs/page1/bg1-right-t.png" alt="">\n' +
      '              </div>\n' +
      '            </div>\n' +
      '            <div class="bottom">\n' +
      '              <img src="./imgs/page1/bg1-right-b.png" alt="">\n' +
      '            </div>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '        <!-- 底部 -->\n' +
      '        <div class="bottom-yezi">\n' +
      '          <img src="./imgs/page1/bg1-b.png" alt="">\n' +
      '        </div>\n' +
      '        <!-- 漂浮的叶子 -->\n' +
      '        <div class="fengye1">\n' +
      '          <img src="./imgs/page1/fengye1.png" alt="">\n' +
      '        </div>\n' +
      '        <div class="fengye2">\n' +
      '          <img src="./imgs/page1/fengye2.png" alt="">\n' +
      '        </div>\n' +
      '        <div class="fengye3">\n' +
      '          <img src="./imgs/page1/fengye3.png" alt="">\n' +
      '        </div>\n' +
      '        <div class="fengye4">\n' +
      '          <img src="./imgs/page1/fengye3.png" alt="">\n' +
      '        </div>\n' +
      '      </div>\n' +
      '      <div class="top-tips">\n' +
      '        <img src="./imgs/tap-tips.png" alt="">\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(greetPageHtmlStr)
  },
  // 用户创建时间
  initCreatePage: function (createTime, togetherDays) {
    if (!createTime) {
      return
    }
    ++this.data.canShowPageNum
    var oTime = this.formateTime(createTime.slice(0, createTime.length - 2))
    var togetherDaysStr = togetherDays.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,')
    var createPageHtmlStr = '<div class="page-item item2 swiper-slide">\n' +
      '      <div class="p-top">\n' +
      '        <img src="./imgs/top1.png" alt="">\n' +
      '      </div>\n' +
      '      <div class="p-bottom">\n' +
      '        <img src="./imgs/bottom1.png" alt="">\n' +
      '      </div>\n' +
      '      <div class="center">\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2"><span class="font1">' + oTime.year + '</span>年<span class="font1">' + oTime.month +
      '</span>月<span class="font1">' + oTime.day + '</span>日 初见</p>\n' +
      (togetherDays > 0 ? ('<p class="font2">今天是我们认识的第</p>\n' +
        '<p class="font2"><span class="font1"> ' + togetherDaysStr + ' </span> 天</p>\n') : '') +
      '          <div class="regular-text font1">世间所有的相遇都是重逢</div>\n' +
      '        </div>\n' +
      '        <!-- 荡秋千的女孩 -->\n' +
      '        <div class="main-girl">\n' +
      '          <div class="girl">\n' +
      '            <img src="./imgs/page2/girl.png" alt="">\n' +
      '          </div>\n' +
      '          <!-- 腿 -->\n' +
      '          <div class="legs"></div>\n' +
      '          <!-- 裙子 -->\n' +
      '          <div class="qunzi">\n' +
      '            <img src="./imgs/page2/qunzi.png" alt="">\n' +
      '          </div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(createPageHtmlStr)
  },
  // 相见次数
  initMeetPage: function (meetCounts, continuousDays) {
    if (!meetCounts) {
      return
    }
    ++this.data.canShowPageNum
    var meetPageHtmlStr = '<div class="page-item item3 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2">这一年，我们相见 <span class="font1"> ' + meetCounts + ' </span>次</p>\n' +
      '          <p class="font2">最多连续 <span class="font1"> ' + continuousDays + ' </span>天一直在一起</p>\n' +
      '          <div class="regular-text font1">女生间总有说不完的小秘密</div>\n' +
      '        </div>\n' +
      '        <div class="main-girl">\n' +
      '         <div class="clock">' +
      '            <img src="./imgs/page3/clock.png" alt="">   ' +
      '         </div>  \n' +
      '          <div class="minute-hand">\n' +
      '            <img src="./imgs/page3/minute-hand.png" alt="">\n' +
      '          </div>\n' +
      '          <div class="girl">\n' +
      '            <img src="./imgs/page3/girl.png" alt="">\n' +
      '          </div>\n' +
      // '          <div class="hair"></div>\n' +
      '          <div class="zhengqi"></div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(meetPageHtmlStr)
  },
  // 广场
  initSquarePage: function (allSquareNum, favoriteSquare, counts, percent) {
    if (!allSquareNum) {
      return
    }
    ++this.data.canShowPageNum
    var squarePageHtmlStr = '<div class="page-item item4 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2">你的足迹踏遍了<span class="font1"> ' + allSquareNum + ' </span>大广场</p>\n' +
      '          <p class="font2">最喜欢的是 <span class="font1">' + favoriteSquare + '</span> 广场</p>\n' +
      '          <p class="font2">一年中共去过 <span class="font1">' + counts + '</span> 次</p>\n' +
      (percent > 0 ? '<p class="font2">有 <span class="font1">' + percent + '%</span> 小主和你一样</p>\n' : '') +
      '          <div class="regular-text font1">哦，原来你也在这里</div>\n' +
      '        </div>\n' +
      '        <div class="main-girl">\n' +
      '          <div class="girl">\n' +
      '            <img src="./imgs/page4/girl.png" alt="">\n' +
      '          </div>\n' +
      '          <div class="arm"></div>\n' +
      '          <div class="note"></div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(squarePageHtmlStr)
  },
  // 评论点赞
  initCommentPage: function (postsCount, commentCount, flowerNum, praiseNum) {
    if (!postsCount && !commentCount && !flowerNum && !praiseNum) {
      return
    }
    ++this.data.canShowPageNum
    var commentPageHtmlStr = '<div class="page-item item5 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="top-boat">\n' +
      '          <div class="boat">\n' +
      '            <img src="./imgs/page5/boat.png" alt="">\n' +
      '          </div>\n' +
      '          <div class="light">\n' +
      '            <img src="./imgs/page5/light.png" alt="">\n' +
      '          </div>\n' +
      '        </div>\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2">你总共发出了</p>\n' +
      '          <p class="font2">' + (postsCount > 0 ? '<span class="font1">' + postsCount + '</span>个帖子' : '') +
      (commentCount > 0 ? '<span class="font1 ml60">' + commentCount + '</span>条评论</p>' : '') + '\n' +
      '          <p class="font2 mt30">送出了</p>\n' +
      '          <p class="font2">' + (flowerNum > 0 ? '<span class="font1">' + flowerNum + '</span>朵花' : '') +
      (praiseNum > 0 ? '<span class="font1 ml100">' + praiseNum + '</span>个赞</p>\n' : '') +
      '          <div class="font-bg">\n' +
      '            <img src="./imgs/page5/font-bg.png" alt="">\n' +
      '          </div>\n' +
      '          <div class="regular-text font1">表达是记录，是分享，更是创造</div>\n' +
      '        </div>\n' +
      '        <div class="girl">\n' +
      '          <div class="hair"></div>\n' +
      '          <div class="qunzi"></div>\n' +
      '          <div class="body">\n' +
      '            <img src="./imgs/page5/girl.png" alt="">\n' +
      '          </div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(commentPageHtmlStr)
  },
  // 收到的评论点赞
  initReceivePage: function (receiveFlowerCount, receiveCommentCount, receivePraiseCount) {
    if (!receiveFlowerCount && !receiveCommentCount && !receivePraiseCount) {
      return
    }
    ++this.data.canShowPageNum
    var receivePageHtmlStr = '<div class="page-item item6 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2">你也收获了朋友们</p>\n' +
      (receiveFlowerCount > 0 ? '<p class="font2"><span>' + receiveFlowerCount + '</span>朵花</p>\n' : '') +
      (receiveCommentCount > 0 ? '<p class="font2"><span>' + receiveCommentCount + '</span>条评论</p>\n' : '') +
      (receivePraiseCount > 0 ? '<p class="font2"><span>' + receivePraiseCount + '</span>个赞</p>\n' : '') +
      '          <div class="font-bg">\n' +
      '            <img src="./imgs/page6/font-bg.png" alt="">\n' +
      '          </div>\n' +
      '          <div class="regular-text font1">女人心事，说给女人听</div>\n' +
      '        </div>\n' +
      '        <div class="ripple-purple">\n' +
      '          <img src="./imgs/page6/ripple-purple.png" alt="">\n' +
      '        </div>\n' +
      '        <div class="ripple-purple">\n' +
      '          <img src="./imgs/page6/ripple-purple.png" alt="">\n' +
      '        </div>\n' +
      '        <div class="ripple-purple">\n' +
      '          <img src="./imgs/page6/ripple-purple.png" alt="">\n' +
      '        </div>\n' +
      '        <div class="ripple-purple">\n' +
      '          <img src="./imgs/page6/ripple-purple.png" alt="">\n' +
      '        </div>\n' +
      '        <div class="ripple-white">\n' +
      '          <img src="./imgs/page6/ripple-white.png" alt="">\n' +
      '        </div>\n' +
      '        <div class="main-girl">\n' +
      '          <div class="girl">\n' +
      '            <img src="./imgs/page6/girl.png" alt="">\n' +
      '          </div>\n' +
      '          <div class="hair"></div>\n' +
      '          <div class="qunzi"></div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(receivePageHtmlStr)
  },
  // 好友
  initFriendPage: function (toYouUserAvatar, toYouUserName, toYouInteractCount, fromYouUserAvatar, fromYouUserName, fromYouInteractCount) {
    if (!toYouInteractCount && !fromYouInteractCount) {
      return
    }
    ++this.data.canShowPageNum
    var friendPageHtmlStr = '<div class="page-item item7 swiper-slide">\n' +
      '      <div class="center">\n' +
      (toYouInteractCount > 0 ? '<div class="text-top">\n' +
        '          <p class="font2">最常和你交流的是 </p>\n' +
        '          <div class="user">\n' +
        '            <div class="avatar">\n' +
        '              <img\n' +
        '                  src="' + toYouUserAvatar + '"\n' +
        '                  alt="">\n' +
        '            </div>\n' +
        '            <p class="font2 nickname line-1">' + toYouUserName + '</p>\n' +
        '          </div>\n' +
        '          <p class="font2">她和你互动高达 <span class="font1">' + toYouInteractCount + '</span> 次</p>\n' +
        '        </div>\n' : '') +
      (fromYouInteractCount > 0 ? '        <div class="text-bottom">\n' +
        '          <p class="font2">你最愿意回应的是</p>\n' +
        '          <div class="user">\n' +
        '            <div class="avatar">\n' +
        '              <img\n' +
        '                  src="' + fromYouUserAvatar + '"\n' +
        '                  alt="">\n' +
        '            </div>\n' +
        '            <p class="font2 nickname line-1">' + fromYouUserName + '</p>\n' +
        '          </div>\n' +
        '          <p class="font2">你和她互动高达 <span class="font1">' + fromYouInteractCount + '</span> 次</p>\n' +
        '        </div>\n' : '') +
      '        <div class="user-l">\n' +
      '          <img src="./imgs/page7/user-l.png" alt="">\n' +
      '          <div class="qiqiu"></div>\n' +
      '        </div>\n' +
      '        <div class="user-r">\n' +
      '          <img src="./imgs/page7/user-r.png" alt="">\n' +
      '        </div>\n' +
      '        <p class="font1 regular-text">社区存知己，天涯若比邻</p>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(friendPageHtmlStr)
  },
  // 等级
  initGradePage: function (score, fansNum) {
    ++this.data.canShowPageNum
    var oGrade = this.getUserGrade(score)
    var gradePageHtmlStr = ' <div class="page-item item8 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2">作为 <span class="font1">' + oGrade.gradeName + '</span></p>\n' +
      (fansNum > 50 ? '<p class="font2">你坐拥 <span class="font1">' + fansNum + '</span> 粉丝</p>\n' : '') +
      '          <p class="font2">等级排名超过了她社区 <span class="font1">' + Math.round(oGrade.percent / 100) + '%</span> 用户</p>\n' +
      '          <div class="regular-text font1">高处的风景是不是更美丽</div>\n' +
      '        </div>\n' +
      '        <div class="main-girl">\n' +
      '          <div class="girl">\n' +
      '            <img src="./imgs/page8/girl.png" alt="">\n' +
      '          </div>\n' +
      '          <div class="qunzi"></div>\n' +
      '          <div class="hair"></div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(gradePageHtmlStr)
  },
  // 奖品
  initPrizePage: function (prize) {
    if (!prize) {
      return
    }
    ++this.data.canShowPageNum
    var prizePageHtmlStr = '<div class="page-item item9 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2">凭借自己的努力， </p>\n' +
      '          <p class="font2">你收获了：<span class="font2">' + prize + '</span></p>\n' +
      '          <div class="regular-text font1">希望它能让你看到更广阔的世界</div>\n' +
      '        </div>\n' +
      '        <div class="main-girl">\n' +
      '          <div class="ribbon">\n' +
      '            <img src="imgs/page9/caidai.png" alt="">\n' +
      '          </div>\n' +
      '          <div class="girl">\n' +
      '            <img src="imgs/page9/girl.png" alt="">\n' +
      '            <div class="hair"></div>\n' +
      '            <div class="qunzi"></div>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(prizePageHtmlStr)
  },
  // 凌晨
  initNightPage: function (time) {
    if (!time) {
      return
    }
    ++this.data.canShowPageNum
    var oTime = this.formateTime(time)
    var timeStr = oTime.hours + ':' + oTime.minutes
    var nightPageHtmlStr = '<div class="page-item item10 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2">凌晨的 <span class="font1">' + timeStr + '</span></p>\n' +
      '          <p class="font2">你在自拍广场发了一个帖子 </p>\n' +
      '          <div class="regular-text font1">睡不着的夜，她社区陪你</div>\n' +
      '        </div>\n' +
      '        <div class="main-girl">\n' +
      '          <div class="girl">\n' +
      '            <img src="./imgs/page10/girl.png" alt="">\n' +
      '            <div class="zhengqi"></div>\n' +
      '            <div class="star"></div>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(nightPageHtmlStr)
  },
  // 怀孕
  initPregnancyPage: function (babyGestationDate) {
    if (!babyGestationDate) {
      return
    }
    ++this.data.canShowPageNum
    var pregnancyPageHtmlStr = '<div class="page-item item11 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2">这一年，你又有了新的牵挂。</p>\n' +
      '          <div class="regular-text font1">我们和你一起期待宝宝的出生</div>\n' +
      '        </div>\n' +
      '        <div class="girl">\n' +
      '          <img src="./imgs/page11/girl.png" alt="">\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(pregnancyPageHtmlStr)
  },
  // 生育
  initBirthPage: function (birthTime) {
    if (!birthTime) {
      return
    }
    ++this.data.canShowPageNum
    var oTime = this.formateTime(birthTime)
    var birthPageHtmlStr = '<div class="page-item item12 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2"><span class="font1">' + oTime.year +
      '</span>年<span class="font1">' + oTime.month + '</span>月<span class="font1">' + oTime.day + '</span>日\n' +
      '          <p class="font2">小天使降临</p>\n' +
      '          <div class="regular-text font1">从此你牵挂的事由多了一些</div>\n' +
      '        </div>\n' +
      '        <div class="girl">\n' +
      '          <img src="./imgs/page12/girl.png" alt="">\n' +
      '          <div class="child"></div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(birthPageHtmlStr)
  },

  // 节日
  initFestivalPage: function (festivalArray) {
    var festivalShowData = null
    for (var i = 0; i < festivalArray.length; i++) {
      if (festivalArray[i].site) {
        festivalShowData = festivalArray[i]
        break
      }
    }
    if (!festivalShowData) {
      return
    }
    ++this.data.canShowPageNum
    var festivalPageHtmlStr = ' <div class="page-item item13 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="p-top">\n' +
      '          <img src="imgs/page13/top-13.png" alt="">\n' +
      '        </div>\n' +
      '        <div class="text-con">\n' +
      '          <p class="font2"><span class="font2">' + festivalShowData.name + '</span>那天，在<span class="font2">' +
      festivalShowData.site + '</span>，</p>\n' +
      '          <p class="font2">有 <span clas="font1">' + festivalShowData.peopleNum + '</span> 位小主和你一起度过呦！</p>\n' +
      '          <div class="regular-text font1">眼前人是有缘人</div>\n' +
      '        </div>\n' +
      '        <div class="p-bottom">\n' +
      '          <img src="imgs/page13/bottom-13.png" alt="">\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>'
    this.$swiperWrapper.append(festivalPageHtmlStr)
  },

  // 结尾
  initEndPage: function (avatar, username, keyword, memo) {
    if (!keyword) {
      return
    }
    ++this.data.canShowPageNum
    var endPageHtmlStr = '<div class="page-item item14 swiper-slide">\n' +
      '      <div class="center">\n' +
      '        <div class="text-main">\n' +
      '          <div class="user">\n' +
      '            <div class="avatar">\n' +
      '              <img\n' +
      '                  src="' + avatar + '"\n' +
      '                  alt="">\n' +
      '            </div>\n' +
      '            <p class="nickname">' + username + '</p>\n' +
      '            <p style="margin-left: 8px;">的关键词</p>\n' +
      '          </div>\n' +
      '          <div class="text">\n' +
      '            <p class="keyword">' + keyword + '</p>\n' +
      '            <p class="desc">' + memo + '</p>\n' +
      '          </div>\n' +
      '          <div class="top-yezi"></div>\n' +
      '          <div class="bottom-yezi"></div>\n' +
      '        </div>\n' +
      (this.data.from === 'default' ? '        <div class="get-share-img ta-share">分享我的2018</div>\n' : '        <div' +
        ' class="get-share-img viewmine">查看我的2018</div>\n') +
      '        <p class="see-again">再看一遍</p>\n' +
      '        <div class="qr-code">\n' +
      '          <img\n' +
      '              src="./imgs/page14/ta-qr-code.jpg"\n' +
      '              alt="">\n' +
      '          <p>扫码看报告</p>\n' +
      '        </div>\n' +
      '      </div>'

    this.$swiperWrapper.append(endPageHtmlStr)
  },

  // 根据积分得出用户等级
  getUserGrade: function (score) {
    if (score === 0) {
      return {
        gradeName: '民女',
        percent: 20
      }
    } else if (score === 1) {
      return {
        gradeName: '秀女',
        percent: 31 - 1 / score
      }
    } else if (score >= 20 && score < 100) {
      return {
        gradeName: '答应',
        percent: 40 - 20 / score
      }
    } else if (score >= 100 && score < 400) {
      return {
        gradeName: '常在',
        percent: 50 - 100 / score
      }
    } else if (score >= 400 && score < 1000) {
      return {
        gradeName: '贵人',
        percent: 70 - 400 / score
      }
    } else if (score >= 1000 && score < 2000) {
      return {
        gradeName: '嫔',
        percent: 75 - 1000 / score
      }
    } else if (score >= 2000 && score < 6000) {
      return {
        gradeName: '侧妃',
        percent: 80 - 2000 / score
      }
    } else if (score >= 6000 && score < 10000) {
      return {
        gradeName: '妃',
        percent: 85 - 6000 / score
      }
    } else if (score >= 10000 && score < 35000) {
      return {
        gradeName: '贵妃',
        percent: 90 - 10000 / score
      }
    } else if (score >= 35000 && score < 70001) {
      return {
        gradeName: '皇贵妃',
        percent: 95 - 35000 / score
      }
    } else if (score >= 70001) {
      return {
        gradeName: '皇后',
        percent: 95 + 70001 / score
      }
    }
  },
  formateTime: function (time) {
    var oTime = new Date(time.replace(/-/g, '/'))
    var year = oTime.getFullYear()
    var month = oTime.getMonth() + 1
    var day = oTime.getDate()
    var hours = oTime.getHours()
    var minutes = oTime.getMinutes()
    return {
      year: year,
      month: month >= 10 ? month : '0' + month,
      day: day >= 10 ? day : '0' + day,
      hours: hours >= 10 ? hours : '0' + hours,
      minutes: minutes >= 10 ? minutes : '0' + minutes
    }
  }
}


window.onload = function () {
  indexPage.init()
}