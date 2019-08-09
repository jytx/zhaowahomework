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

    /**
     * 创建英雄类
     * @author LiQun
     * @date 2019-08-09
     */
    function Hero() {
      this.ctx = context;
      this.img = heroImg;
      this.imgPos = {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      };
      this.rect = {
        x: 0,
        y: 0,
        width: 40,
        height: 40,
      };
    }

    Hero.prototype.horizontalMaxNum = horizontalMaxNum;
    Hero.prototype.verticalMaxNum = verticalMaxNum;
    Hero.prototype.heroWalk = function () {
      if (this.imgPos.x >= 96) {
        this.imgPos.x = 0;
      } else {
        this.imgPos.x = this.imgPos.x + this.imgPos.width;
      }
    };
    Hero.prototype.draw = draw;
    /**
     * 移动方法
     * @author LiQun
     * @date 2019-08-09
     * @param keyCode 键位code
     */
    Hero.prototype.move = function (keyCode) {
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
    };
    /**
     * 清除画布上元素
     * @author LiQun
     * @date 2019-08-04
     */
    Hero.prototype.clear = function () {
      this.ctx.clearRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    };

    /**
     * 创建父类对象
     * @author LiQun
     * @date 2019-08-09
     * @param initPost 初始位置对象,包含参数x: 初始x位置,y:初始y位置
     */
    function Monster(initPost) {
      this.ctx = context;
      this.img = allSpriteImg;
      this.imgPos = {
        x: 495,
        y: 627,
        width: 32,
        height: 64
      };
      this.rect = {
        x: initPost.x,
        y: initPost.y,
        width: 40,
        height: 40,
      }
    }
    /**
     * 定义Monster类上的方法
     * @author LiQun
     * @date 2019-08-09
     */
    Monster.prototype.draw = draw;

    function RedMonster(initPost) {
      // 执行父类,将父类属性加入到子类中
      Monster.call(this, initPost);
      this.imgPos = {
        x: 858,
        y: 529,
        width: 32,
        height: 32
      };
    }
    // 将父类的prototype指向子类的__proto__
    RedMonster.prototype = Object.create(Monster.prototype);

    function BlackMonster(initPost) {
      Monster.call(this, initPost);
      this.imgPos = {
        x: 858,
        y: 497,
        width: 32,
        height: 32
      };
      this.rect.width = 50;
      this.rect.height = 50;
    }

    BlackMonster.prototype = Object.create(Monster.prototype);

    const monster1 = new RedMonster({x: 200, y: 200});
    const monster2 = new BlackMonster({x: 250, y: 250});
    const hero = new Hero();
    hero.draw();
    monster1.draw();
    monster2.draw();

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
