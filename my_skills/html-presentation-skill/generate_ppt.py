#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate HTML presentation from ppt.md with strict 1 chunk = 1 slide mapping.
"""

import json
import re
from pathlib import Path

# Paths
base_dir = Path(__file__).parent
chunks_dir = base_dir / '.chunks_ppt'
assets_dir = base_dir / 'assets'
source_dir = Path('/Users/andrewlee/Desktop/Projects/SKILLS/my_skills/side')

# Image path mapping - images are in source_dir
image_paths = {
    'image.png': str(source_dir / 'image.png'),
    'image-1.png': str(source_dir / 'image-1.png'),
    'image-2.png': str(source_dir / 'image-2.png'),
    'image-3.png': str(source_dir / 'image-3.png'),
    'image-4.png': str(source_dir / 'image-4.png'),
    'image-5.png': str(source_dir / 'image-5.png'),
    'image-6.png': str(source_dir / 'image-6.png'),
}

def markdown_to_html(md_content):
    """Convert markdown content to HTML with strict 1:1 mapping."""

    lines = md_content.strip().split('\n')
    html_parts = []
    in_code_block = False
    in_list = False
    code_block_lang = ''

    for line in lines:
        # Handle code blocks
        if line.strip().startswith('```'):
            if in_code_block:
                html_parts.append('</code></pre>')
                in_code_block = False
            else:
                code_block_lang = line.strip()[3:].strip()
                html_parts.append(f'<pre><code class="language-{code_block_lang}">')
                in_code_block = True
            continue

        if in_code_block:
            # Escape HTML in code blocks
            escaped = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            html_parts.append(escaped)
            continue

        # Handle images
        img_match = line.strip()
        if img_match.startswith('![alt text]('):
            img_name = img_match[img_match.find('(')+1:img_match.rfind(')')]
            if img_name in image_paths:
                html_parts.append(f'<img src="{image_paths[img_name]}" alt="{img_name}">')
            continue

        # Handle headings
        if line.startswith('#### '):
            html_parts.append(f'<h4>{line[5:]}</h4>')
        elif line.startswith('### '):
            html_parts.append(f'<h3>{line[4:]}</h3>')
        elif line.startswith('## '):
            html_parts.append(f'<h2>{line[3:]}</h2>')
        elif line.startswith('# '):
            html_parts.append(f'<h1>{line[2:]}</h1>')
        # Handle lists
        elif line.strip().startswith('* ') or line.strip().startswith('- '):
            if not in_list:
                html_parts.append('<ul>')
                in_list = True
            content = line.strip()[2:]
            # Handle bold and inline code in list items
            content = process_inline(content)
            html_parts.append(f'<li>{content}</li>')
        # Handle numbered lists
        elif line.strip() and line.strip()[0].isdigit() and '. ' in line.strip():
            if not in_list:
                html_parts.append('<ol>')
                in_list = True
            content = line.strip().split('. ', 1)[1] if '. ' in line.strip() else line.strip()
            content = process_inline(content)
            html_parts.append(f'<li>{content}</li>')
        # Handle tables - simple conversion
        elif line.strip().startswith('|') and line.strip().endswith('|'):
            # Skip separator lines
            if re.match(r'^\|[\s\-:|]+\|$', line.strip()):
                continue
            cells = line.strip().split('|')[1:-1]
            html_parts.append('<div class="table-row">')
            for cell in cells:
                html_parts.append(f'<span class="table-cell">{process_inline(cell.strip())}</span>')
            html_parts.append('</div>')
        # Handle tab-separated tables
        elif '\t' in line and line.count('\t') >= 2 and not in_code_block:
            # Check if this looks like a table row (multiple columns)
            cells = line.split('\t')
            if len(cells) >= 3:
                html_parts.append('<div class="table-row">')
                for cell in cells:
                    html_parts.append(f'<span class="table-cell">{process_inline(cell.strip())}</span>')
                html_parts.append('</div>')
        # Handle horizontal rules (shouldn't appear in chunks, but just in case)
        elif line.strip() == '---':
            html_parts.append('<hr>')
        # Handle blockquotes
        elif line.strip().startswith('>'):
            html_parts.append(f'<blockquote>{process_inline(line[1:].strip())}</blockquote>')
        # Handle empty lines
        elif not line.strip():
            if in_list:
                if html_parts and html_parts[-1].endswith('</ul>'):
                    pass
                elif html_parts and html_parts[-1].endswith('</ol>'):
                    pass
                else:
                    html_parts.append('</ul>' if '<ul>' in ''.join(html_parts[-5:]) else '</ol>')
                    in_list = False
            html_parts.append('')
        # Handle regular paragraphs
        elif line.strip():
            if in_list:
                html_parts.append('</ul>' if '<ul>' in ''.join(html_parts[-5:]) else '</ol>')
                in_list = False
            content = process_inline(line.strip())
            html_parts.append(f'<p>{content}</p>')

    # Close any open lists
    if in_list:
        html_parts.append('</ul>' if '<ul>' in ''.join(html_parts[-5:]) else '</ol>')

    return '\n'.join(html_parts)


def process_inline(text):
    """Process inline markdown: bold, code, links."""
    import re
    # Handle inline code first (to avoid processing markdown inside code)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    # Handle bold
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    # Handle italic
    text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)
    # Handle links
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    return text


def generate_slide_html(chunk_content, chunk_index, chunk_title):
    """Generate HTML for a single slide from chunk content."""

    # Detect layout based on content
    content_lower = chunk_content.lower()

    # Cover page
    if chunk_index == 0:
        layout_class = 'slide-cover'
    # Section/chapter pages
    elif chunk_content.strip().startswith('## 第') or chunk_content.strip().startswith('### 第'):
        layout_class = 'slide-section'
    else:
        layout_class = ''

    # Convert markdown to HTML
    content_html = markdown_to_html(chunk_content)

    # Wrap in slide div
    slide_html = f'<div class="slide {layout_class}'.strip() + '">'
    slide_html += f'\n<div class="slide-content">'
    slide_html += f'\n{content_html}'
    slide_html += f'\n</div>'
    slide_html += f'\n</div>'

    return slide_html


def main():
    """Main entry point."""
    import re

    # Read all chunks in order
    chunk_files = sorted(chunks_dir.glob('*.md'))
    slides_html = []

    for chunk_file in chunk_files:
        with open(chunk_file, 'r', encoding='utf-8') as f:
            chunk_content = f.read()

        # Extract title from filename
        title_match = re.match(r'\d+_(.+)\.md', chunk_file.name)
        chunk_title = title_match.group(1) if title_match else chunk_file.stem

        # Get chunk index from filename
        index_match = re.match(r'(\d+)_', chunk_file.name)
        chunk_index = int(index_match.group(1)) if index_match else 0

        # Generate slide HTML
        slide_html = generate_slide_html(chunk_content, chunk_index, chunk_title)
        slides_html.append(slide_html)
        print(f"Generated slide {chunk_index}: {chunk_title}")

    print(f"\nTotal slides generated: {len(slides_html)}")

    # Create slides data
    output_path = base_dir / 'output' / 'ppt_presentation.html'
    slides_data = {
        'slides': slides_html,
        'theme': 'academic',
        'animation': 'fade',
        'title': 'AI 编程助手生态全景："百虾大战"时代',
        'output': str(output_path)
    }

    # Create output directory
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Save slides JSON for assemble.py
    slides_json_path = base_dir / '.slides_data.json'
    with open(slides_json_path, 'w', encoding='utf-8') as f:
        json.dump(slides_data, f, ensure_ascii=False, indent=2)

    # Assemble final HTML using assemble.py
    import subprocess
    result = subprocess.run(
        ['python3', str(base_dir / 'assemble.py'), str(slides_json_path)],
        capture_output=True,
        text=True
    )

    print(result.stdout)
    if result.stderr:
        print(result.stderr)

    print(f"\nOutput written to: {slides_data['output']}")


if __name__ == '__main__':
    main()
