// 初始化目录折叠功能
document.addEventListener('DOMContentLoaded', function () {
  // 获取DOM元素
  const toggleButtons = document.querySelectorAll('.toggle-button');
  const toggleAllBtn = document.getElementById('toggle-all');
  const tocLinks = document.querySelectorAll('.toc-link');
  const headers = document.querySelectorAll('h2, h3');

  // 目录项折叠/展开功能
  toggleButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.stopPropagation(); // 防止触发父级的点击事件

      const parentItem = this.closest('.has-children');
      const childList = parentItem.querySelector('.toc-children');
      const icon = this.querySelector('i');

      // 切换折叠状态
      if (childList.style.maxHeight) {
        childList.style.maxHeight = null;
        icon.classList.remove('rotate-180');
      } else {
        childList.style.maxHeight = childList.scrollHeight + 'px';
        icon.classList.add('rotate-180');
      }
    });
  });

  // 初始展开第一个有子项的目录
  const firstHasChildren = document.querySelector('.has-children');
  if (firstHasChildren) {
    const firstChildList = firstHasChildren.querySelector('.toc-children');
    const firstIcon = firstHasChildren.querySelector('.toggle-button i');

    firstChildList.style.maxHeight = firstChildList.scrollHeight + 'px';
    firstIcon.classList.add('rotate-180');
  }

  // 全部展开/折叠功能
  toggleAllBtn.addEventListener('click', function () {
    const isExpanded = this.innerHTML.includes('compress');

    toggleButtons.forEach(button => {
      const parentItem = button.closest('.has-children');
      const childList = parentItem.querySelector('.toc-children');
      const icon = button.querySelector('i');

      if (isExpanded) {
        // 收起全部
        childList.style.maxHeight = null;
        icon.classList.remove('rotate-180');
      } else {
        // 展开全部
        childList.style.maxHeight = childList.scrollHeight + 'px';
        icon.classList.add('rotate-180');
      }
    });

    // 切换按钮文本和图标
    this.innerHTML = isExpanded
      ? '<i class="fa fa-expand mr-1"></i>展开全部'
      : '<i class="fa fa-compress mr-1"></i>收起全部';
  });

  // 滚动时高亮当前章节
  window.addEventListener('scroll', function () {
    let currentSection = '';

    headers.forEach(header => {
      const headerTop = header.offsetTop - 80; // 考虑顶部偏移

      if (window.scrollY >= headerTop) {
        currentSection = header.getAttribute('id');
      }
    });

    // 更新目录高亮
    tocLinks.forEach(link => {
      link.classList.remove('bg-primary/10', 'text-primary', 'font-medium');

      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('bg-primary/10', 'text-primary', 'font-medium');

        // 确保当前章节所在的折叠项是展开的
        const parentItem = link.closest('.toc-item.has-children');
        if (parentItem) {
          const childList = parentItem.querySelector('.toc-children');
          const icon = parentItem.querySelector('.toggle-button i');

          childList.style.maxHeight = childList.scrollHeight + 'px';
          icon.classList.add('rotate-180');
        }
      }
    });
  });

  // 平滑滚动
  tocLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // 平滑滚动到目标位置
        window.scrollTo({
          top: targetElement.offsetTop - 80, // 考虑顶部偏移
          behavior: 'smooth'
        });

        // 更新URL但不触发滚动
        history.pushState(null, null, targetId);
      }
    });
  });
});


// 初始化 particles.js 动态背景
document.addEventListener('DOMContentLoaded', function () {
  // 创建背景容器并插入到页面底部
  const particlesDiv = document.createElement('div');
  particlesDiv.id = 'particles-js';
  particlesDiv.style.position = 'fixed';
  particlesDiv.style.top = '0';
  particlesDiv.style.left = '0';
  particlesDiv.style.width = '100%';
  particlesDiv.style.height = '100%';
  particlesDiv.style.zIndex = '-1';   // 确保放置于所有内容下方
  particlesDiv.style.pointerEvents = 'none'; // 防止阻挡鼠标事件，但下方配置的 onhover 依赖 canvas 自己的拦截，所以如果想有互动，需特别处理。
  // Mkdocs Material 会有各种层叠，我们需要使其背景融入。如果希望鼠标互动：
  // 先把 pointerEvents 打开，依靠 z-index 放到最底层即可
  particlesDiv.style.pointerEvents = 'auto';

  document.body.appendChild(particlesDiv);

  // 确保 particlesJS 加载完毕后再执行
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 120,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#f3afca"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 4,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 80,
          "color": "#f3afca",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 1,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "window",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "repulse"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 200,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 250,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
    console.log('particles.js loaded via extra.js');
  } else {
    console.warn("particlesJS is not defined. Ensure CDN is loaded in mkdocs.yml.");
  }
});