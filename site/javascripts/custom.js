// 添加 Cloudflare Workers 代理函数
function fetchViaProxy(apiUrl) {
  // 替换为您的 Worker 地址
  const proxyUrl = 'https://late-credit-fbd5.1787190669.workers.dev';
  
  // 使用 encodeURIComponent 确保特殊字符正确处理
  return fetch(`${proxyUrl}?url=${encodeURIComponent(apiUrl)}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    });
}

// 示例：获取 GitHub 仓库信息
async function loadGitHubRepos() {
  try {
    const repos = await fetchViaProxy('https://api.github.com/users/Brent050830/repos');
    console.log('Fetched repositories:', repos);
    
    // 在这里处理数据并更新页面...
    
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 调用 API 加载函数
  loadGitHubRepos();
  
  // 其他初始化代码...
});