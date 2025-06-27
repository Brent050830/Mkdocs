document.addEventListener('DOMContentLoaded', () => {
  // 折叠/展开功能
  document.querySelectorAll('.md-nav__toggle').forEach(toggle => {
    // 恢复本地存储的状态
    const savedState = localStorage.getItem(`toc-collapse-${toggle.id}`);
    if (savedState !== null) {
      toggle.checked = savedState === 'true';
    }
    
    // 保存状态
    toggle.addEventListener('change', () => {
      localStorage.setItem(`toc-collapse-${toggle.id}`, toggle.checked);
    });
  });
  
  // 平滑滚动（可选）
  document.querySelectorAll('.md-nav__link[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});