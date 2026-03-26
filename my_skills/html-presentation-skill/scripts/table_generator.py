#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Table Generator - Tool Script for HTML Presentation Skill

Generates美观 HTML tables from structured data.

Usage:
    python table_generator.py  # Run test/demo
    # Or import as module:
    #   from table_generator import generate_html_table

Dependencies: Standard library only

Example:
    data = {'header': ['Name', 'Value'], 'rows': [['A', 1], ['B', 2]]}
    html = generate_html_table(data, style='striped')
"""

# /// script
# dependencies = []
# ///

import re


def generate_html_table(table_data, style='default'):
    """Generate an HTML table from structured data.

    Args:
        table_data: Dictionary with keys:
            - header: List of column headers
            - rows: List of row data (each row is a list)
        style: Table style - 'default', 'striped', 'bordered', 'compact'

    Returns:
        HTML table string. Empty string if table_data is invalid.

    Example:
        >>> data = {'header': ['Name', 'Value'], 'rows': [['A', '1']]}
        >>> generate_html_table(data, style='striped')
        '<table class="data-table table-striped">...'
    """
    if not table_data or not table_data.get('header'):
        return ''

    header = table_data['header']
    rows = table_data.get('rows', [])

    # Build table class
    table_class = 'data-table'
    if style == 'striped':
        table_class += ' table-striped'
    elif style == 'bordered':
        table_class += ' table-bordered'
    elif style == 'compact':
        table_class += ' table-compact'

    html = f'<table class="{table_class}">\n'

    # Table header
    html += '  <thead>\n    <tr>\n'
    for cell in header:
        html += f'      <th>{cell}</th>\n'
    html += '    </tr>\n  </thead>\n'

    # Table body
    if rows:
        html += '  <tbody>\n'
        for row in rows:
            html += '    <tr>\n'
            # Ensure row has same columns as header
            for i in range(len(header)):
                cell = row[i] if i < len(row) else ''
                html += f'      <td>{cell}</td>\n'
            html += '    </tr>\n'
        html += '  </tbody>\n'

    html += '</table>'
    return html


def generate_comparison_table(items, columns):
    """Generate a comparison table.

    Args:
        items: List of items to compare, each with 'name' and 'values' keys
        columns: List of comparison dimensions

    Returns:
        HTML comparison table string
    """
    html = '<table class="data-table table-bordered">\n'

    # Header
    html += '  <thead>\n    <tr>\n'
    html += '      <th>Item</th>\n'
    for col in columns:
        html += f'      <th>{col}</th>\n'
    html += '    </tr>\n  </thead>\n'

    # Body
    html += '  <tbody>\n'
    for item in items:
        html += '    <tr>\n'
        html += f'      <td><strong>{item["name"]}</strong></td>\n'
        for col in columns:
            value = item.get('values', {}).get(col, '-')
            html += f'      <td>{value}</td>\n'
        html += '    </tr>\n'
    html += '  </tbody>\n'

    html += '</table>'
    return html


def generate_feature_matrix(features, products):
    """Generate a feature matrix table.

    Args:
        features: List of features, each with 'name' and 'supported' keys
        products: List of product names

    Returns:
        HTML feature matrix table string
    """
    html = '<table class="data-table feature-matrix">\n'

    # Header
    html += '  <thead>\n    <tr>\n'
    html += '      <th>Feature</th>\n'
    for product in products:
        html += f'      <th>{product}</th>\n'
    html += '    </tr>\n  </thead>\n'

    # Body
    html += '  <tbody>\n'
    for feature in features:
        html += '    <tr>\n'
        html += f'      <td>{feature["name"]}</td>\n'
        for product in products:
            supported = product in feature.get('supported', [])
            icon = '✓' if supported else '-'
            cell_class = 'supported' if supported else 'unsupported'
            html += f'      <td class="{cell_class}">{icon}</td>\n'
        html += '    </tr>\n'
    html += '  </tbody>\n'

    html += '</table>'
    return html


def add_table_styles():
    """Return CSS styles for tables.

    Returns:
        CSS string containing table styles
    """
    return '''
    /* Data table styles */
    .data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
        font-size: 0.95rem;
    }

    .data-table th,
    .data-table td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
    }

    .data-table th {
        font-weight: 600;
        background: var(--bg-secondary, #f5f5f5);
        color: var(--text-primary, #1a1a1a);
    }

    .data-table tr:hover {
        background: var(--bg-hover, #f0f0f0);
    }

    /* Striped rows */
    .table-striped tbody tr:nth-child(even) {
        background: var(--bg-secondary, rgba(0,0,0,0.02));
    }

    /* Bordered table */
    .table-bordered th,
    .table-bordered td {
        border: 1px solid var(--border-color, #e0e0e0);
    }

    /* Compact table */
    .table-compact th,
    .table-compact td {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
    }

    /* Feature matrix */
    .feature-matrix .supported {
        color: var(--success-color, #22c55e);
        font-weight: 600;
    }

    .feature-matrix .unsupported {
        color: var(--text-muted, #999);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .data-table {
            font-size: 0.8rem;
        }

        .data-table th,
        .data-table td {
            padding: 0.5rem;
        }
    }
    '''


def main():
    """Run demo/test output."""
    test_data = {
        'header': ['Feature', 'Description', 'Status'],
        'rows': [
            ['Table Generation', 'Generate HTML tables dynamically', 'Complete'],
            ['Chart Generation', 'Canvas/SVG rendering', 'In Progress'],
            ['Content Analysis', 'Smart content type detection', 'Complete']
        ]
    }

    print("Generated table (striped style):")
    print(generate_html_table(test_data, style='striped'))


if __name__ == '__main__':
    main()
