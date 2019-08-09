/**
 *
 * @author LiQun
 * @date 2019-08-03
 */
(function () {
  const canvas = document.querySelector('#game');
  const context = canvas.getContext('2d');
  const heroImg = new Image();
  const allSpriteImg = new Image();
  const width = canvas.width;
  const height = canvas.height;

  function prepare() {
    let loaded = false;
    /**
     * 自定义获取图片对象方法
     * @param img {Object} 图片对象
     * @param src {string} 图片路径
     * @returns {Promise}
     */
    const imgLoader = (img, src) => {
      return new Promise((resolve, reject) => {
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      })
    };

    const allResources = Promise.all([imgLoader(heroImg, './img/hero.png'), imgLoader(allSpriteImg, './img/all.jpg')]);

    return {
      /**
       * 获取资源
       * @author LiQun
       * @date 2019-08-04
       * @param {Function} [callback]
       */
      getResources(callback) {
        if (loaded) {
          !!callback && callback(context, heroImg, allSpriteImg);
          return;
        }
        loaded = true;
        allResources.then(function () {
          // 获取资源文件后,执行回调
          !!callback && callback(context, heroImg, allSpriteImg);
        });
      }
    }
  }

  /**
   * 绘制图片
   * @author LiQun
   * @date 2019-08-04
   * @param context
   * @param heroImg 英雄图片对象
   * @param allSpriteImg 怪物图片对象
   */
  function drawImage(context, heroImg, allSpriteImg) {
    const draw = function () {
      this.ctx.drawImage(this.img, this.imgPos.x, this.imgPos.y, this.imgPos.width, this.imgPos.height, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    };
    const horizontalMaxNum = function () {
      return Math.floor(width / this.rect.width);
    };
    const verticalMaxNum = function () {
      return Math.floor(height / this.rect.height);
    };
    const hero = {
      ctx: context,
      img: heroImg,
      imgPos: {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      },
      rect: {
        x: 0,
        y: 0,
        width: 40,
        height: 40,
      },
      horizontalMaxNum: horizontalMaxNum,
      verticalMaxNum: verticalMaxNum,
      heroWalk: function () {
        if (this.imgPos.x >= 96) {
          this.imgPos.x = 0;
        } else {
          this.imgPos.x = this.imgPos.x + this.imgPos.width;
        }
      },
      draw,
      move: function (keyCode) {
        hero.clear();
        if (keyCode === 37) {
          // 左
          if (this.rect.x >= this.rect.width) {
            this.rect.x = this.rect.x - this.rect.width;
            this.imgPos.y = 32;
            this.heroWalk();
          }
        } else if (keyCode === 38) {
          // 上
          if (this.rect.y >= this.rect.height) {
            this.rect.y = this.rect.y - this.rect.height;
            this.imgPos.y = 96;
            this.heroWalk();
          }
        } else if (keyCode === 39) {
          // 右
          if (this.rect.x < this.horizontalMaxNum() * this.rect.width) {
            this.rect.x = this.rect.x + this.rect.width;
            this.imgPos.y = 64;
            this.heroWalk();
          }
        } else if (keyCode === 40) {
          // 下
          if (this.rect.y < this.verticalMaxNum() * this.rect.height) {
            this.rect.y = this.rect.y + this.rect.height;
            this.imgPos.y = 0;
            this.heroWalk();
          }
        }
        hero.draw();
      },
      /**
       * 清除画布上元素
       * @author LiQun
       * @date 2019-08-04
       */
      clear: function () {
        this.ctx.clearRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      }
    };
    const monster = {
      ctx: context,
      img: allSpriteImg,
      imgPos: {
        x: 495,
        y: 627,
        width: 32,
        height: 64
      },
      rect: {
        x: 200,
        y: 200,
        width: 40,
        height: 80,
      },
      draw
    };
    hero.draw();
    monster.draw();

    /**
     * 监听键盘事件
     * @author LiQun
     * @date 2019-08-04
     * @param event 事件对象
     */
    document.onkeydown = function (event) {
      const keyCode = event.keyCode;
      // 如果没有到monster所在位置,则继续前进
      hero.move(keyCode);
    };
  }

  const resourceManager = prepare();
  resourceManager.getResources(function (context, heroImg, allSpriteImg) {
    drawImage(context, heroImg, allSpriteImg);
  });
})();
