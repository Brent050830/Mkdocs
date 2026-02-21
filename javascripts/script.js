function initCodeMoreBox() {
    let codeBlocks = document.querySelectorAll(".highlight");
    if (!codeBlocks) {
        return;
    }
    codeBlocks.forEach(codeBlock => {
        // 校验代码块是否需要展开
        if (codeBlock.scrollHeight <= codeBlock.clientHeight) {
            return;  // 如果代码块没有被截断，不需要折叠按钮
        }

        // 创建更多按钮容器
        let codeMoreBox = document.createElement('div');
        codeMoreBox.classList.add('code-more-box');
        
        // 创建折叠按钮
        let codeMoreBtn = document.createElement('span');
        codeMoreBtn.classList.add('code-more-btn');
        
        // 设置点击事件，展开代码块
        codeMoreBtn.addEventListener('click', () => {
            codeBlock.classList.add('code-show');  // 展开代码块
            codeMoreBox.style.display = 'none';    // 隐藏折叠按钮
            // 触发resize事件，重新计算目录位置
            window.dispatchEvent(new Event('resize'));
        });
        
        // 创建图片作为按钮的图标
        let img = document.createElement('img');
        img.classList.add('code-more-img');
        img.src = "/assets/icons/codeMore.png";  // 使用相对路径，确保图片正确加载
        
        // 将图片添加到按钮中
        codeMoreBtn.appendChild(img);
        codeMoreBox.appendChild(codeMoreBtn);

        // 将折叠按钮容器添加到代码块
        codeBlock.appendChild(codeMoreBox);
    });
}

// 确保 DOM 加载完毕后再执行初始化
document.addEventListener("DOMContentLoaded", initCodeMoreBox);