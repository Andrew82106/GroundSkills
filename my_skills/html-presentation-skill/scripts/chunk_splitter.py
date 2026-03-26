#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Markdown Chunk Splitter - Tool Script for HTML Presentation Skill

Splits Markdown documents into slide chunks by separator (---).

Usage:
    python chunk_splitter.py input.md -o output_dir/
    python chunk_splitter.py input.md --validate

Dependencies: Standard library only (no external packages required)
"""

# /// script
# dependencies = []
# ///

import os
import re
import shutil
import argparse
import sys
from pathlib import Path


class ChunkSplitterError(Exception):
    """Base exception for chunk splitter errors."""
    pass


class FileNotFoundError(ChunkSplitterError):
    """Raised when input file is not found."""
    pass


class InvalidFormatError(ChunkSplitterError):
    """Raised when Markdown format has critical errors."""
    pass


def split_markdown_by_separator(markdown_path, output_dir):
    """
    Split Markdown file by horizontal rule separators (---).

    Each section is saved as an independent .md file.

    Args:
        markdown_path: Path to input Markdown file
        output_dir: Directory to output chunk files

    Returns:
        List of chunk dictionaries with keys:
        - index: Chunk sequence number
        - title: Section title (or generated)
        - path: Output file path
        - content: Raw Markdown content
        - type: Detected content type

    Raises:
        FileNotFoundError: If input file doesn't exist
        InvalidFormatError: If Markdown has critical format errors
    """
    # Validate input file exists
    if not os.path.exists(markdown_path):
        raise FileNotFoundError(f"Input file not found: {markdown_path}")

    # Clean and create output directory
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir, exist_ok=True)

    # Read Markdown file
    try:
        with open(markdown_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError as e:
        raise InvalidFormatError(f"Failed to read file (encoding error): {e}")

    # Split by horizontal rule (--- must be on its own line)
    pattern = r'^---\s*$'
    parts = re.split(pattern, content, flags=re.MULTILINE)

    # Filter empty content
    parts = [p.strip() for p in parts if p.strip()]

    if not parts:
        print("Warning: No content found in input file", file=sys.stderr)
        return []

    chunks = []

    for i, part in enumerate(parts):
        # Get title from first heading
        title_match = re.search(r'^#+\s*(.+)$', part, re.MULTILINE)
        if title_match:
            title = title_match.group(1).strip()
        else:
            # No heading - use first 30 chars as identifier
            first_line = part.split('\n')[0][:30]
            title = first_line if first_line else f'part_{i}'

        chunk_path = save_chunk(output_dir, title, part, i)
        chunks.append({
            'index': i,
            'title': title,
            'path': chunk_path,
            'content': part,
            'type': detect_chunk_type(part)
        })

    print(f"Split {len(chunks)} sections to: {output_dir}")
    return chunks


def save_chunk(output_dir, title, content, index):
    """Save a chunk section to file.

    Args:
        output_dir: Output directory path
        title: Section title (used in filename)
        content: Markdown content
        index: Section index (zero-based)

    Returns:
        Path to saved file
    """
    # Sanitize title for filename
    safe_title = re.sub(r'[^\w\u4e00-\u9fff\-_]', '_', title)
    safe_title = safe_title[:50]  # Limit length

    filename = f'{index:02d}_{safe_title}.md'
    filepath = os.path.join(output_dir, filename)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return filepath


def detect_chunk_type(content):
    """Detect chunk content type for visualization decision.

    Analyzes content to determine the best visualization approach.

    Args:
        content: Markdown chunk content

    Returns:
        Type string: 'text', 'table', 'chart', 'code', or 'mixed'
    """
    # Check for tables
    has_table = bool(re.search(r'^\|.*\|', content, re.MULTILINE))

    # Check for data (suitable for charts)
    has_data = bool(re.search(r'\d+[%\s→]|增长 | 下降 | 比例 | 占比', content))

    # Check for code blocks
    has_code = '```' in content

    # Check for lists
    has_list = bool(re.search(r'^[-*]\s+', content, re.MULTILINE))

    # Check for comparison data (multiple numbers per line)
    lines = content.split('\n')
    data_lines = []
    for line in lines:
        numbers = re.findall(r'\d+', line)
        if len(numbers) >= 2:
            data_lines.append(line)

    has_chart_data = len(data_lines) >= 2

    # Determine type
    if has_chart_data and not has_table:
        return 'chart'
    elif has_table:
        return 'table'
    elif has_code:
        return 'code'
    elif has_list:
        return 'mixed'
    else:
        return 'text'


def validate_markdown(markdown_path):
    """Validate Markdown file format.

    Args:
        markdown_path: Path to Markdown file

    Returns:
        Tuple of (is_valid, errors, warnings)
        - is_valid: Boolean indicating if file is valid
        - errors: List of critical errors (must fix)
        - warnings: List of non-critical issues (should fix)
    """
    errors = []
    warnings = []

    try:
        with open(markdown_path, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.split('\n')
    except FileNotFoundError:
        errors.append(f"File not found: {markdown_path}")
        return False, errors, warnings
    except UnicodeDecodeError as e:
        errors.append(f"Encoding error: {e}")
        return False, errors, warnings

    # Check for empty content
    if not content.strip():
        errors.append("File content is empty")
        return False, errors, warnings

    # Check for separators
    separator_count = len(re.findall(r'^---\s*$', content, re.MULTILINE))
    if separator_count == 0:
        warnings.append("No separators (---) found - entire document will be one slide")

    # Check for headings
    has_title = bool(re.search(r'^#+\s*.+$', content, re.MULTILINE))
    if not has_title:
        warnings.append("No headings found - recommend adding headings for each slide")

    # Check first section has cover heading
    parts = re.split(r'^---\s*$', content, flags=re.MULTILINE)
    if parts:
        first_part = parts[0].strip()
        if not re.search(r'^#\s+.+$', first_part, re.MULTILINE):
            warnings.append("Cover page missing main heading (# heading)")

    # Check for unclosed code blocks
    code_block_count = content.count('```')
    if code_block_count % 2 != 0:
        errors.append(f"Unclosed code block found (``` appears {code_block_count} times, should be even)")

    is_valid = len(errors) == 0
    return is_valid, errors, warnings


def main():
    """Main entry point with --help support for agentic use.

    Usage:
        python chunk_splitter.py input.md -o output_dir/
        python chunk_splitter.py input.md --validate

    Exit codes:
        0: Success
        1: Error (validation failed or file not found)
    """
    parser = argparse.ArgumentParser(
        description='Markdown Chunk Splitter - Split Markdown by --- separators',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python chunk_splitter.py presentation.md -o chunks/
  python chunk_splitter.py presentation.md --validate
        '''
    )
    parser.add_argument('input', type=str, help='Input Markdown file path')
    parser.add_argument('-o', '--output', type=str, default='.chunks',
                        help='Output directory path (default: .chunks)')
    parser.add_argument('--validate', action='store_true',
                        help='Validate only, do not split')

    args = parser.parse_args()

    # Validate first
    is_valid, errors, warnings = validate_markdown(args.input)

    if warnings:
        print("\nWarnings:")
        for w in warnings:
            print(f"  - {w}")

    if errors:
        print("\nErrors:")
        for e in errors:
            print(f"  - {e}")
        print("\nPlease fix errors before splitting.")
        return 1

    if args.validate:
        print("\nValidation passed - file format is valid.")
        return 0

    # Execute split
    try:
        chunks = split_markdown_by_separator(args.input, args.output)
    except FileNotFoundError as e:
        print(f"\nError: {e}", file=sys.stderr)
        return 1
    except InvalidFormatError as e:
        print(f"\nError: {e}", file=sys.stderr)
        return 1

    # Output chunk info
    print("\nChunks:")
    for chunk in chunks:
        print(f"  [{chunk['index']}] {chunk['title']} - type: {chunk['type']}")

    return 0


if __name__ == '__main__':
    exit(main())
