#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Content Analyzer - Tool Script for HTML Presentation Skill

Analyzes Markdown chunks to extract structured information for rendering.
Detects content type (cover, toc, content, end) and extracts elements like
tables, charts, code blocks, and lists.

Usage:
    python content_analyzer.py chunk.md
    python content_analyzer.py chunk.md --json

Dependencies: Standard library only
"""

# /// script
# dependencies = []
# ///

import json
import re
import sys
from pathlib import Path


class ContentAnalyzer:
    """Content analyzer for Markdown presentation chunks."""

    def __init__(self):
        self.visualization_types = {
            'text': 'Plain text display',
            'list': 'List display',
            'table': 'Table display',
            'chart_bar': 'Bar chart',
            'chart_line': 'Line chart',
            'chart_pie': 'Pie chart',
            'code': 'Code block',
            'mixed': 'Mixed display',
            'card': 'Card display',
            'timeline': 'Timeline'
        }

    def analyze(self, content):
        """
        Analyze content and return structured information.

        Args:
            content: Markdown chunk content

        Returns:
            Dictionary with keys:
            - type: 'text', 'table', 'chart', or 'mixed'
            - title: Section title
            - elements: List of renderable elements
            - chart_data: Chart data if detected
            - table_data: Table data if detected
            - suggestions: Display suggestions
        """
        result = {
            'type': 'text',
            'title': self._extract_title(content),
            'elements': [],
            'chart_data': None,
            'table_data': None,
            'suggestions': []
        }

        # Extract elements
        result['elements'] = self._extract_elements(content)

        # Detect tables
        tables = self._extract_tables(content)
        if tables:
            result['table_data'] = tables
            result['suggestions'].append('Use table for structured data')

        # Detect chart data
        chart_data = self._extract_chart_data(content)
        if chart_data:
            result['chart_data'] = chart_data
            result['suggestions'].append('Use chart for data comparison')

        # Detect code blocks
        codes = self._extract_codes(content)
        if codes:
            result['suggestions'].append('Use syntax highlighting for code')

        # Decide primary type
        result['type'] = self._decide_type(result)

        return result

    def _extract_title(self, content):
        """Extract the main title from content."""
        match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        return match.group(1) if match else 'Untitled'

    def _extract_elements(self, content):
        """Extract all renderable elements."""
        elements = []

        # Extract subtitles (h3)
        for match in re.finditer(r'^###\s+(.+)$', content, re.MULTILINE):
            elements.append({
                'type': 'subtitle',
                'content': match.group(1)
            })

        # Extract lists
        list_items = []
        in_list = False
        for line in content.split('\n'):
            if re.match(r'^[-*]\s+', line):
                if not in_list:
                    in_list = True
                list_items.append(re.sub(r'^[-*]\s+', '', line))
            elif in_list and line.strip():
                in_list = False
                elements.append({
                    'type': 'list',
                    'items': list_items
                })
                list_items = []

        if list_items:
            elements.append({
                'type': 'list',
                'items': list_items
            })

        # Extract paragraphs
        paragraphs = self._extract_paragraphs(content)
        for p in paragraphs:
            elements.append({
                'type': 'paragraph',
                'content': p
            })

        return elements

    def _extract_paragraphs(self, content):
        """Extract paragraphs from content."""
        paragraphs = []
        current = []

        for line in content.split('\n'):
            # Skip headings, lists, code blocks, tables
            if (line.startswith('#') or line.startswith('```') or
                line.startswith('|') or re.match(r'^[-*]\s+', line)):
                if current:
                    paragraphs.append(' '.join(current))
                    current = []
                continue

            if line.strip():
                current.append(line.strip())
            elif current:
                paragraphs.append(' '.join(current))
                current = []

        if current:
            paragraphs.append(' '.join(current))

        return paragraphs

    def _extract_tables(self, content):
        """Extract table data from Markdown.

        Returns:
            List of table dictionaries with 'header' and 'rows' keys
        """
        tables = []
        lines = content.split('\n')

        in_table = False
        current_table = []

        for line in lines:
            if re.match(r'^\|.*\|', line):
                in_table = True
                # Skip separator row
                if not re.match(r'^\|?\s*[-:|]+\s*\|?\s*$', line):
                    cells = [c.strip() for c in line.split('|') if c.strip()]
                    current_table.append(cells)
            elif in_table:
                if current_table:
                    tables.append({
                        'header': current_table[0],
                        'rows': current_table[1:]
                    })
                    current_table = []
                in_table = False

        if current_table:
            tables.append({
                'header': current_table[0],
                'rows': current_table[1:]
            })

        return tables

    def _extract_chart_data(self, content):
        """Extract data suitable for chart visualization.

        Looks for patterns like "Name: 100" or "Name 增长 50%"

        Returns:
            Chart data dictionary or None
        """
        chart_data = {
            'type': None,
            'labels': [],
            'datasets': []
        }

        # Pattern for name + value extraction
        data_pattern = re.compile(
            r'([^\d]+?)(\d+(?:\.\d+)?)\s*(?:%|万 | 千 | 百万)?\s*(?:增长 | 下降 | 占比 | 比例)?',
            re.IGNORECASE
        )

        lines = content.split('\n')
        data_points = []

        for line in lines:
            # Skip tables and code blocks
            if '|' in line or '```' in line:
                continue

            # Find name and value combinations
            matches = data_pattern.findall(line)
            if matches and len(matches) >= 1:
                for name, value in matches:
                    name = name.strip()
                    # Clean up the name
                    name = re.sub(r'[：:,\s]+$', '', name)
                    if name and len(name) < 50:  # Reasonable name length
                        data_points.append({
                            'label': name,
                            'value': float(value)
                        })

        if len(data_points) >= 2:
            chart_data['type'] = 'bar' if len(data_points) <= 8 else 'line'
            chart_data['labels'] = [d['label'] for d in data_points]
            chart_data['datasets'] = [{
                'label': 'Value',
                'data': [d['value'] for d in data_points]
            }]
            return chart_data

        return None

    def _extract_codes(self, content):
        """Extract code blocks from content.

        Returns:
            List of code dictionaries with 'language' and 'content' keys
        """
        codes = []
        in_code = False
        current_code = []
        lang = ''

        for line in content.split('\n'):
            if line.startswith('```'):
                if not in_code:
                    in_code = True
                    lang = line[3:].strip()
                else:
                    codes.append({
                        'language': lang,
                        'content': '\n'.join(current_code)
                    })
                    current_code = []
                    in_code = False
            elif in_code:
                current_code.append(line)

        return codes

    def _decide_type(self, result):
        """Decide the best display type based on extracted data."""
        if result['chart_data']:
            return 'chart'
        elif result['table_data']:
            return 'table'
        elif any(e['type'] == 'list' for e in result['elements']):
            return 'mixed'
        else:
            return 'text'


def analyze_chunk(chunk_path):
    """Analyze a single Markdown chunk file.

    Args:
        chunk_path: Path to the chunk file

    Returns:
        Analysis result dictionary

    Raises:
        FileNotFoundError: If chunk file doesn't exist
    """
    path = Path(chunk_path)
    if not path.exists():
        raise FileNotFoundError(f"Chunk file not found: {chunk_path}")

    with open(chunk_path, 'r', encoding='utf-8') as f:
        content = f.read()

    analyzer = ContentAnalyzer()
    return analyzer.analyze(content)


def main():
    """Main entry point with --help support for agentic use.

    Usage:
        python content_analyzer.py chunk.md
        python content_analyzer.py chunk.md --json

    Exit codes:
        0: Success
        1: Error (file not found, etc.)
    """
    if len(sys.argv) < 2 or '--help' in sys.argv or '-h' in sys.argv:
        print("Usage: python content_analyzer.py <chunk_file.md> [--json]")
        print("\nAnalyze a Markdown chunk and output structured information.")
        print("\nOptions:")
        print("  --json    Output as JSON (default: human-readable)")
        print("\nOutput includes:")
        print("  - type: Best display type (text/table/chart/mixed)")
        print("  - title: Section title")
        print("  - elements: Extracted elements (headings, lists, etc.)")
        print("  - table_data: Extracted table data (if any)")
        print("  - chart_data: Extracted chart data (if any)")
        sys.exit(1)

    chunk_path = sys.argv[1]
    output_json = '--json' in sys.argv

    # Analyze
    try:
        result = analyze_chunk(chunk_path)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error analyzing file: {e}", file=sys.stderr)
        sys.exit(1)

    # Output
    if output_json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(f"Type: {result['type']}")
        print(f"Title: {result['title']}")
        print(f"Has Table: {result['table_data'] is not None}")
        print(f"Has Chart Data: {result['chart_data'] is not None}")
        print(f"\nSuggestions:")
        for s in result['suggestions']:
            print(f"  - {s}")


if __name__ == '__main__':
    main()
