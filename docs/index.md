---
hide:
  - navigation
  - toc
  - path
---

<style>
  /* 隐藏左上角的默认 h1 标题 */
  .md-content__inner > h1 {
    display: none !important;
  }
</style>

<div class="home-wrapper">
  <div class="home-grid" id="random-cards-container">
    <!-- 动态生成的卡片将插入在这里 -->
    <div>加载漫游笔记中...</div>
  </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  // MkDocs 的 search 插件会生成 search/search_index.json，我们通过它来获取所有页面信息
  fetch('search/search_index.json')
    .then(response => response.json())
    .then(data => {
      // 过滤掉索引页(index.md)、不需要的文件夹和页面
      const docs = data.docs.filter(doc => {
        let url = doc.location;
        let title = doc.title;
        // 排除锚点链接、无效链接和没有标题的内容
        if (url === "" || url === "index.html" || url.includes("#") || !title) return false;
        
        const decodedUrl = decodeURIComponent(url);
        // 排除“随笔”、“.obsidian”、“Excalidraw”、“标签”、“blog” 等非 nav 内规划的内容
        if (decodedUrl.startsWith("随笔/") || decodedUrl === "随笔.html") return false;
        if (decodedUrl.startsWith(".obsidian/")) return false;
        if (decodedUrl.startsWith("Excalidraw/")) return false;
        if (decodedUrl.startsWith("tag/") || decodedUrl === "tag.html") return false;
        if (decodedUrl.startsWith("blog/") || decodedUrl === "blog.html") return false;

        return true;
      });

      if (docs.length === 0) {
        document.getElementById('random-cards-container').innerHTML = '<div>未能找到笔记数据。</div>';
        return;
      }

      // 随机打乱数组并取前 4 个
      const shuffledDocs = docs.sort(() => 0.5 - Math.random());
      const selectedDocs = shuffledDocs.slice(0, 4);

      // 预定义一些卡片背景色和图标，让展示更好看![alt text](image.png)
      const cardStyles = [
        { bg: "#20b2aa", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="currentColor"/></svg>' },
        { bg: "#e06c75", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z" fill="currentColor"/></svg>' },
        { bg: "#e5c07b", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 6h10.29l1.04 3H5.81l1.04-3zM7.5 15c-.83 0-1.5-.67-1.5-1.5S6.67 12 7.5 12s1.5.67 1.5 1.5S8.33 15 7.5 15zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/></svg>' },
        { bg: "#61afef", icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/></svg>' }
      ];

      // 生成 HTML
      let htmlContent = '';
      selectedDocs.forEach((doc, index) => {
        // 由于 mkdocs 搜索索引包含大量类似 "阅读时间: X 分钟 | 中文字符：" 的元数据，我们尝试去掉它们
        let cleanText = doc.text.replace(/阅读时间：.*?中文字符：[0-9]+/g, '');
        cleanText = cleanText.replace(/阅读信息自动隐藏/g, '');
        // 去除换行和多余空格
        cleanText = cleanText.replace(/\s+/g, ' ').trim();
        let excerpt = cleanText.substring(0, 70);
        if (cleanText.length > 70) excerpt += '...';

        // 提取类别作为 footer（基于 url 路径），并且利用 decodeURIComponent 解码中文
        let decodedUrl = decodeURIComponent(doc.location);

        // 使用最高级别的正则清理：直接去除 doc.title 开头所有的各种“数字、点、空格、特殊标点符号”
        // \d 代表数字，\s 代表空白，\.\- 匹配点和横线，\uff0e\u3000 是全角点号和全角空格
        let cleanTitle = doc.title.replace(/^[\d\s\.\-—_\uff0e\u3000]+/, '');

        // 如果名字被不小心全删光了，做个安全回退
        if (!cleanTitle) {
          cleanTitle = doc.title;
        }

        // 终极暴力截断：如果还是有 "0.1 " 这4个字符开头，直接切掉它！
        if (cleanTitle.startsWith("0.1 ")) {
            cleanTitle = cleanTitle.substring(4);
        } else if (cleanTitle.startsWith("0.1")) {
            cleanTitle = cleanTitle.substring(3);
        }
        
        let pathParts = decodedUrl.replace(/\/$/, '').split('/');
        let rawFilename = pathParts[pathParts.length - 1];
        let category = pathParts.filter(p => p !== '' && p !== rawFilename).join(' / ');
        if (!category) category = '笔记漫游';
        // 删掉最后跟着的 / 以及替换横线
        category = category.replace(/-/g, ' ');
        
        let style = cardStyles[index % cardStyles.length];

        htmlContent += `
          <a href="${doc.location}" class="home-card" title="${cleanTitle}">
            <div class="home-card-image" style="background: ${style.bg};">
              ${style.icon}
            </div>
            <div class="home-card-content">
              <div class="home-card-jump">↗ 点击跳转</div>
              <h3 class="home-card-title">${cleanTitle}</h3>
              <div class="home-card-meta">
                <span><span class="twemoji">✨</span> 漫游笔记</span>
              </div>
              <p class="home-card-desc">${excerpt}</p>
              <div class="home-card-footer">${category}</div>
            </div>
          </a>
        `;
      });
      document.getElementById('random-cards-container').innerHTML = htmlContent;
    })
    .catch(error => {
      console.error('Error loading search index:', error);
      document.getElementById('random-cards-container').innerHTML = '<div>加载笔记出错。</div>';
    });
});
</script>
