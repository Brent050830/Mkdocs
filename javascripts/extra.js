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
  particlesDiv.style.pointerEvents = 'auto'; // 允许鼠标事件进行排斥

  document.body.appendChild(particlesDiv);

  // 动态更新剪裁区域，使得粒子的画布在文章主体区域被“物理挖空”
  function updateParticleMask() {
    // 专门抓取文章的实际内容区域（不包含左右侧边栏目录）
    const mainContent = document.querySelector('.md-content');
    if (!mainContent) return;

    // 获取文章主体的屏幕坐标
    const rect = mainContent.getBoundingClientRect();

    // 如果屏幕非常窄（手机端），为了避免完全看不到特效，我们可以不挖空，或者仅仅稍微缩减一点挖空范围
    if (rect.width > window.innerWidth * 0.95) {
      // 手机端让背景完全被压在底部即可，因为本来横向空间就很小
      particlesDiv.style.clipPath = 'none';
      return;
    }

    // 使用 CSS clip-path: polygon 绘制一个带有中心镂空的遮罩
    // 这会在画布中心切出一个完全透明的长方形，使得左、右侧边栏均能显示特效，唯独中间文字区没有。
    const left = rect.left;
    const right = rect.right;
    const top = 0; // 从屏幕最顶部切开，防止头部的标题也被背景覆盖
    const bottom = window.innerHeight; // 直到屏幕最底部

    // 使用奇偶环绕规则挖除非零环绕洞：大矩形顺时针，小矩形逆时针
    // 由于浏览器兼容性，更稳妥的做法是切分成四块外围矩形。
    const clipPathStr = `polygon(
      0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 
      ${left}px ${top}px, ${left}px ${bottom}px, ${right}px ${bottom}px, ${right}px ${top}px, ${left}px ${top}px
    )`;
    // 奇偶填充规则在clip-path中需要明确指定 fill-rule
    // 不过 polygon 配合 clip-rule: evenodd 是最佳做法。
    particlesDiv.style.clipPath = clipPathStr;
    particlesDiv.style.clipRule = 'evenodd';
  }

  // 初次更新和窗口变化时更新
  window.addEventListener('resize', updateParticleMask);
  window.addEventListener('scroll', updateParticleMask);
  // 加个小延迟确保DOM排版完成
  setTimeout(updateParticleMask, 500);

  // 确保 particlesJS 加载完毕后再执行
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 120,
          "density": { "enable": true, "value_area": 800 }
        },
        "color": { "value": "#f3afca" },
        "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } },
        "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } },
        "size": { "value": 4, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
        "line_linked": { "enable": true, "distance": 80, "color": "#f3afca", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
      },
      "interactivity": {
        "detect_on": "window",
        "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true },
        "modes": { "grab": { "distance": 200, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 250, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } }
      },
      "retina_detect": true
    });
    console.log('particles.js loaded via extra.js with center hole mask');
  } else {
    console.warn("particlesJS is not defined. Ensure CDN is loaded in mkdocs.yml.");
  }
});