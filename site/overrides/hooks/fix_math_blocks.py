import re
import glob
import argparse

def wrap_math_blocks(content):
    """
    为所有 $$...$$ 公式块添加 <!-- $$ --> 保护注释
    """
    # 正则匹配 $$...$$（支持多行）
    pattern = re.compile(r'\$\$(.*?)\$\$', re.DOTALL)
    # 替换为带注释的版本
    return pattern.sub(r'<!-- $$ -->\n$$\1$$\n<!-- $$ -->', content)

def process_files(input_dir, output_dir=None):
    """
    处理目录中的所有 Markdown 文件
    """
    for filepath in glob.glob(f"{input_dir}/**/*.md", recursive=True):
        # 读取文件
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 处理公式块
        new_content = wrap_math_blocks(content)
        
        # 输出到原文件或指定目录
        if output_dir:
            import os
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, os.path.basename(filepath))
        else:
            output_path = filepath
        
        # 写入文件
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Processed: {filepath}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='自动为 Markdown 文件中的 $$...$$ 公式添加保护注释')
    parser.add_argument('--input', default='docs', help='输入目录（默认: docs）')
    parser.add_argument('--output', help='输出目录（默认覆盖原文件）')
    args = parser.parse_args()
    
    process_files(args.input, args.output)