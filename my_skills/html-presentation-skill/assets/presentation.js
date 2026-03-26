/**
 * HTML Presentation Core
 * 幻灯片核心控制逻辑
 */

class Presentation {
  constructor(options = {}) {
    // 配置选项
    this.config = {
      theme: options.theme || 'minimalist',
      animation: options.animation || 'fade',
      direction: options.direction || 'horizontal',
      showProgress: options.showProgress !== false,
      showIndicator: options.showIndicator !== false,
      showSlideNumber: options.showSlideNumber !== false,
      keyboardNavigation: options.keyboardNavigation !== false,
      touchNavigation: options.touchNavigation !== false,
      autoPlay: options.autoPlay || false,
      autoPlayInterval: options.autoPlayInterval || 5000,
      ...options
    };

    // 状态
    this.currentSlide = 0;
    this.slides = [];
    this.totalSlides = 0;
    this.isAnimating = false;
    this.autoPlayTimer = null;

    // DOM 元素
    this.container = null;
    this.slideContainer = null;
    this.progressBar = null;
    this.indicatorContainer = null;
    this.slideNumberEl = null;

    // 侧边导航
    this.sidebarNav = null;
    this.sidebarToggle = null;
    this.sidebarClose = null;
    this.slideList = null;
    this.contentArea = null;
    this.isSidebarOpen = false;

    // 触摸事件
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;

    // 初始化
    this.init();
  }

  /**
   * 初始化演示文稿
   */
  init() {
    this.cacheElements();
    this.collectSlides();
    this.applyTheme();
    this.applyAnimation();
    this.bindEvents();
    this.updateState();
    this.goToSlide(0);

    // 创建侧边幻灯片列表
    this.createSlideList();

    // 启动自动播放
    if (this.config.autoPlay) {
      this.startAutoPlay();
    }

    // 触发初始化完成事件
    this.emit('initialized', {
      totalSlides: this.totalSlides,
      config: this.config
    });
  }

  /**
   * 缓存 DOM 元素
   */
  cacheElements() {
    this.container = document.querySelector('.presentation-container') || document.body;
    this.slideContainer = document.querySelector('.slide-container') || this.container;
    this.progressBar = document.querySelector('.progress-bar');
    this.indicatorContainer = document.querySelector('.nav-indicator');
    this.slideNumberEl = document.querySelector('.slide-number');

    // 侧边导航元素
    this.sidebarNav = document.getElementById('sidebarNav');
    this.sidebarToggle = document.getElementById('sidebarToggle');
    this.sidebarClose = document.getElementById('sidebarClose');
    this.slideList = document.getElementById('slideList');
    this.contentArea = document.getElementById('contentArea');
  }

  /**
   * 收集所有幻灯片
   */
  collectSlides() {
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.totalSlides = this.slides.length;

    // 为每张幻灯片设置索引
    this.slides.forEach((slide, index) => {
      slide.dataset.slideIndex = index;
    });

    // 创建导航指示器
    if (this.config.showIndicator && this.indicatorContainer) {
      this.createIndicators();
    }
  }

  /**
   * 创建导航指示器
   */
  createIndicators() {
    if (!this.indicatorContainer) return;

    this.indicatorContainer.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'nav-dot';
      dot.addEventListener('click', () => this.goToSlide(i));
      this.indicatorContainer.appendChild(dot);
    }
    this.dots = Array.from(this.indicatorContainer.querySelectorAll('.nav-dot'));
  }

  /**
   * 应用主题
   */
  applyTheme() {
    document.body.classList.add(`theme-${this.config.theme}`);
    document.body.classList.remove(
      ...Array.from(document.body.classList).filter(c => c.startsWith('theme-'))
    );
    document.body.classList.add(`theme-${this.config.theme}`);
  }

  /**
   * 应用动画
   */
  applyAnimation() {
    this.container.classList.add(`animation-${this.config.animation}`);
    if (this.config.direction === 'vertical') {
      this.container.classList.add('direction-vertical');
    } else {
      this.container.classList.add('direction-horizontal');
    }
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 键盘导航
    if (this.config.keyboardNavigation) {
      document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // 触摸导航
    if (this.config.touchNavigation) {
      this.bindTouchEvents();
    }

    // 窗口大小变化
    window.addEventListener('resize', () => this.handleResize());

    // 点击导航
    document.addEventListener('click', (e) => this.handleClick(e));

    // 防止默认行为
    document.addEventListener('wheel', (e) => {
      if (this.isAnimating) {
        e.preventDefault();
      }
    }, { passive: false });

    // 侧边栏事件
    this.bindSidebarEvents();
  }

  /**
   * 绑定侧边栏事件
   */
  bindSidebarEvents() {
    if (this.sidebarToggle) {
      this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }
    if (this.sidebarClose) {
      this.sidebarClose.addEventListener('click', () => this.closeSidebar());
    }
    // 点击侧边栏外部关闭
    document.addEventListener('click', (e) => {
      if (this.isSidebarOpen &&
          !this.sidebarNav.contains(e.target) &&
          !this.sidebarToggle.contains(e.target)) {
        this.closeSidebar();
      }
    });
    // ESC 键关闭侧边栏
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isSidebarOpen) {
        this.closeSidebar();
      }
    });
  }

  /**
   * 创建幻灯片列表
   */
  createSlideList() {
    if (!this.slideList) return;

    this.slideList.innerHTML = '';
    this.slideItems = [];

    this.slides.forEach((slide, index) => {
      const li = document.createElement('li');
      li.className = 'slide-item';

      // 获取幻灯片标题
      let title = slide.querySelector('h1, h2, h3')?.textContent || `第 ${index + 1} 页`;
      // 封面页特殊处理
      if (slide.classList.contains('slide-cover')) {
        title = '封面';
      }
      // 目录页特殊处理
      if (slide.classList.contains('slide-toc')) {
        title = '目录';
      }
      // 结束页特殊处理
      if (slide.classList.contains('slide-end') || slide.querySelector('.slide-cover')) {
        if (slide.textContent.includes('谢谢') || slide.textContent.includes('Q&A')) {
          title = '结束页';
        }
      }

      li.innerHTML = `
        <span class="slide-number-badge">${index + 1}</span>
        <span class="slide-title-preview">${title}</span>
      `;

      li.addEventListener('click', () => {
        this.goToSlide(index);
        this.closeSidebar();
      });

      this.slideList.appendChild(li);
      this.slideItems.push(li);
    });
  }

  /**
   * 切换侧边栏
   */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarNav?.classList.toggle('open', this.isSidebarOpen);
    this.contentArea?.classList.toggle('sidebar-open', this.isSidebarOpen);
  }

  /**
   * 关闭侧边栏
   */
  closeSidebar() {
    this.isSidebarOpen = false;
    this.sidebarNav?.classList.remove('open');
    this.contentArea?.classList.remove('sidebar-open');
  }

  /**
   * 打开侧边栏
   */
  openSidebar() {
    this.isSidebarOpen = true;
    this.sidebarNav?.classList.add('open');
    this.contentArea?.classList.add('sidebar-open');
  }

  /**
   * 绑定触摸事件
   */
  bindTouchEvents() {
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.touchEndY = e.changedTouches[0].clientY;
      this.handleSwipe();
    }, { passive: true });
  }

  /**
   * 处理滑动
   */
  handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const threshold = 50; // 滑动阈值

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          this.prev();
        } else {
          this.next();
        }
      }
    } else {
      // 垂直滑动
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          this.prev();
        } else {
          this.next();
        }
      }
    }
  }

  /**
   * 处理键盘事件
   */
  handleKeyboard(e) {
    // 忽略输入框中的键盘事件
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        this.next();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        this.prev();
        break;

      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;

      case 'End':
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
        break;

      case 'n':
      case 'N':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.next();
        }
        break;

      case 'p':
      case 'P':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.prev();
        }
        break;
    }
  }

  /**
   * 处理点击事件
   */
  handleClick(e) {
    // 检查是否点击在控制按钮上
    if (e.target.closest('.btn-next')) {
      this.next();
    } else if (e.target.closest('.btn-prev')) {
      this.prev();
    }
  }

  /**
   * 处理窗口大小变化
   */
  handleResize() {
    this.emit('resize', {
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  /**
   * 跳转到指定幻灯片
   */
  goToSlide(index) {
    if (this.isAnimating || index < 0 || index >= this.totalSlides) {
      return;
    }

    if (index === this.currentSlide) {
      return;
    }

    this.isAnimating = true;
    const fromIndex = this.currentSlide;
    this.currentSlide = index;

    // 更新幻灯片状态
    this.updateSlideState(fromIndex, index);

    // 更新 UI
    this.updateState();

    // 触发动画完成
    const transitionDuration = getComputedStyle(document.documentElement)
      .getPropertyValue('--transition-speed') || '0.5s';
    const duration = parseFloat(transitionDuration) * 1000;

    setTimeout(() => {
      this.isAnimating = false;
      this.emit('slideChanged', {
        index: this.currentSlide,
        fromIndex,
        totalSlides: this.totalSlides
      });
    }, duration);

    // 重置自动播放计时器
    if (this.config.autoPlay) {
      this.resetAutoPlay();
    }
  }

  /**
   * 更新幻灯片状态
   */
  updateSlideState(fromIndex, toIndex) {
    const fromSlide = this.slides[fromIndex];
    const toSlide = this.slides[toIndex];

    if (fromSlide) {
      fromSlide.classList.remove('active');
      fromSlide.classList.add('inactive');

      // 设置方向类
      if (toIndex > fromIndex) {
        fromSlide.classList.add('prev');
        fromSlide.classList.remove('next');
      } else {
        fromSlide.classList.add('next');
        fromSlide.classList.remove('prev');
      }
    }

    if (toSlide) {
      toSlide.classList.remove('inactive', 'prev', 'next');
      toSlide.classList.add('active');
    }

    // 清理远处的幻灯片
    this.slides.forEach((slide, index) => {
      if (Math.abs(index - toIndex) > 2) {
        slide.classList.remove('prev', 'next', 'active', 'inactive');
      }
    });
  }

  /**
   * 更新 UI 状态
   */
  updateState() {
    // 更新进度条
    if (this.progressBar) {
      const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
      this.progressBar.style.width = `${progress}%`;
    }

    // 更新指示器
    if (this.dots) {
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentSlide);
      });
    }

    // 更新幻灯片编号
    if (this.slideNumberEl) {
      this.slideNumberEl.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }

    // 更新侧边栏高亮
    if (this.slideItems) {
      this.slideItems.forEach((item, index) => {
        item.classList.toggle('active', index === this.currentSlide);
      });
    }

    // 更新文档标题
    const title = document.querySelector('.slide-title');
    if (title) {
      document.title = `${title.textContent} - Slide ${this.currentSlide + 1}`;
    }
  }

  /**
   * 下一页
   */
  next() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  /**
   * 上一页
   */
  prev() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  /**
   * 开始自动播放
   */
  startAutoPlay() {
    this.config.autoPlay = true;
    this.autoPlayTimer = setInterval(() => {
      if (this.currentSlide < this.totalSlides - 1) {
        this.next();
      } else {
        this.goToSlide(0);
      }
    }, this.config.autoPlayInterval);
  }

  /**
   * 停止自动播放
   */
  stopAutoPlay() {
    this.config.autoPlay = false;
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  /**
   * 重置自动播放
   */
  resetAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = setInterval(() => {
        if (this.currentSlide < this.totalSlides - 1) {
          this.next();
        } else {
          this.goToSlide(0);
        }
      }, this.config.autoPlayInterval);
    }
  }

  /**
   * 事件发射
   */
  emit(eventName, detail) {
    const event = new CustomEvent(`presentation:${eventName}`, { detail });
    document.dispatchEvent(event);
  }

  /**
   * 监听事件
   */
  on(eventName, callback) {
    document.addEventListener(`presentation:${eventName}`, callback);
    return this;
  }

  /**
   * 销毁演示文稿
   */
  destroy() {
    this.stopAutoPlay();
    document.removeEventListener('keydown', this.handleKeyboard);
    window.removeEventListener('resize', this.handleResize);
    this.emit('destroyed', {});
  }

  /**
   * 获取当前状态
   */
  getState() {
    return {
      currentSlide: this.currentSlide,
      totalSlides: this.totalSlides,
      progress: ((this.currentSlide + 1) / this.totalSlides) * 100,
      config: this.config
    };
  }

  /**
   * 跳转到第一页
   */
  first() {
    this.goToSlide(0);
  }

  /**
   * 跳转到最后一页
   */
  last() {
    this.goToSlide(this.totalSlides - 1);
  }

  /**
   * 切换全屏
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * 打印
   */
  print() {
    window.print();
  }
}

/**
 * 自动初始化
 */
document.addEventListener('DOMContentLoaded', () => {
  // 从 script 标签读取配置
  const script = document.getElementById('presentation-config');
  let config = {};

  if (script && script.type === 'application/json') {
    try {
      config = JSON.parse(script.textContent);
    } catch (e) {
      console.error('Failed to parse presentation config:', e);
    }
  }

  // 创建演示文稿实例
  window.presentation = new Presentation(config);

  // 初始化图片放大功能
  initImageZoom();
});

/**
 * 初始化图片放大功能
 */
function initImageZoom() {
  let modal = null;

  const initSlides = () => {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
      const images = slide.querySelectorAll('img');
      images.forEach(img => {
        // 移除可能的事件监听器重复绑定
        img.style.cursor = 'zoom-in';
        img.onclick = () => {
          if (!modal) {
            modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = '<span class="image-modal-close">&times;</span><img src="" alt="">';
            document.body.appendChild(modal);

            const modalImg = modal.querySelector('img');
            const closeBtn = modal.querySelector('.image-modal-close');

            // 点击关闭按钮
            closeBtn.addEventListener('click', () => {
              modal.classList.remove('active');
            });

            // 点击背景关闭
            modal.addEventListener('click', (e) => {
              if (e.target === modal) {
                modal.classList.remove('active');
              }
            });

            // ESC 关闭
            document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
              }
            });

            // 点击图片关闭
            modalImg.addEventListener('click', () => {
              modal.classList.remove('active');
            });
          }

          modal.querySelector('img').src = img.src;
          modal.classList.add('active');
        };
      });
    });
  };

  // 延迟执行以确保幻灯片已渲染
  setTimeout(initSlides, 100);
}

// 导出（如果支持模块）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Presentation;
}
