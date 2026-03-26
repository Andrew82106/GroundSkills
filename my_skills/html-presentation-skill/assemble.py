#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Helper script to assemble HTML presentation from slides.
This is a simple string replacement tool, not a one-click builder.
"""

# /// script
# dependencies = []
# ///

import sys
from pathlib import Path


def assemble_html(slides_html, theme='academic', animation='fade', title='Presentation'):
    """
    Assemble final HTML from slides and assets.

    This is a helper function that does simple string replacement.
    The main agent should provide the slides_html content.
    """

    # Get paths
    base_dir = Path(__file__).parent
    assets_dir = base_dir / 'assets'

    # Read template
    template_path = assets_dir / 'single-file.html'
    with open(template_path, 'r', encoding='utf-8') as f:
        template = f.read()

    # Read theme CSS
    theme_css_path = assets_dir / 'themes.css'
    with open(theme_css_path, 'r', encoding='utf-8') as f:
        theme_css = f'<style>\n{f.read()}\n</style>'

    # Read animation CSS
    animation_css_path = assets_dir / 'animations.css'
    with open(animation_css_path, 'r', encoding='utf-8') as f:
        animation_css = f'<style>\n{f.read()}\n</style>'

    # Read presentation JS
    presentation_js_path = assets_dir / 'presentation.js'
    with open(presentation_js_path, 'r', encoding='utf-8') as f:
        presentation_js = f'<script>\n{f.read()}\n</script>'

    # Replace placeholders
    html = template
    html = html.replace('{{TITLE}}', title)
    html = html.replace('{{THEME}}', theme)
    html = html.replace('{{ANIMATION}}', animation)
    html = html.replace('{{DIRECTION}}', 'horizontal')
    html = html.replace('{{THEME_CSS}}', theme_css)
    html = html.replace('{{ANIMATION_CSS}}', animation_css)
    html = html.replace('{{PRESENTATION_JS}}', presentation_js)
    html = html.replace('{{SLIDES}}', ''.join(slides_html))

    return html


def main():
    """
    Main entry point.
    This script is meant to be called by the main agent, not users directly.
    """
    if len(sys.argv) < 2:
        print("Usage: python assemble.py <slides_json_file> [--theme academic] [--animation fade]")
        print("This is a helper script for the main agent, not a one-click builder.")
        sys.exit(1)

    # Read slides from JSON file
    slides_file = Path(sys.argv[1])
    import json
    with open(slides_file, 'r', encoding='utf-8') as f:
        slides_data = json.load(f)

    slides_html = slides_data.get('slides', [])
    theme = slides_data.get('theme', 'academic')
    animation = slides_data.get('animation', 'fade')
    title = slides_data.get('title', 'Presentation')

    html = assemble_html(slides_html, theme, animation, title)

    # Output
    output_file = slides_data.get('output', 'output.html')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Generated: {output_file}")
    print(f"Total slides: {len(slides_html)}")


if __name__ == '__main__':
    main()
