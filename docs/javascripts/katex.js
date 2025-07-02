

document$.subscribe(({ body }) => { 
  setTimeout(() => {
    renderMathInElement(body, {
      delimiters: [
        { left: "$$",  right: "$$",  display: true },
        { left: "$",   right: "$",   display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
    extensions: ["amssymb", "amsmath"], 
    throwOnError: false, // 容错，避免小语法错误阻断渲染
    trust: true // 允许使用复杂命令
    });
  }, 500); // 延迟 500ms，可根据实际调整
});