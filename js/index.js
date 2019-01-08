var indexPage = {
  data: {},
  init: function () {
    this.initBackgroundImg()
    this.initPageSwiper()
  },
  initBackgroundImg: function () {
    var $center = $('.center')
    $center.each(function (index, ele) {
      $(ele).css({ 'background-image': 'url(./imgs/bg' + (index + 1) + '.jpg)' })
    })
  },
  addEvents: function () {
  },
  // 初始化页面
  initPageSwiper: function () {
    new Swiper('#container', {
      direction: 'vertical'
    })
  }
}


window.onload = function () {
  indexPage.init()
}