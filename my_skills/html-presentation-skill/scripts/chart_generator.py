#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Chart Generator - Tool Script for HTML Presentation Skill

Generates SVG charts (bar, line, pie) from structured data.

Usage:
    python chart_generator.py  # Run test/demo
    # Or import as module:
    #   from chart_generator import generate_chart_html

Dependencies: Standard library only (uses math module)

Example:
    data = {
        'labels': ['A', 'B', 'C'],
        'datasets': [{'label': 'Values', 'data': [10, 20, 30]}]
    }
    html = generate_chart_html(data, chart_type='bar')
"""

# /// script
# dependencies = []
# ///

import math


def generate_bar_chart(chart_data, width=600, height=400):
    """Generate a bar chart SVG.

    Args:
        chart_data: Dictionary with keys:
            - labels: List of category labels
            - datasets: List of dataset dictionaries with 'label' and 'data'
        width: SVG width in pixels (default: 600)
        height: SVG height in pixels (default: 400)

    Returns:
        SVG string. Empty string if chart_data is invalid.
    """
    if not chart_data or not chart_data.get('datasets'):
        return ''

    labels = chart_data.get('labels', [])
    data = chart_data['datasets'][0].get('data', [])

    if not labels or not data:
        return ''

    # Margins
    margin = {'top': 40, 'right': 30, 'bottom': 60, 'left': 60}
    chart_width = width - margin['left'] - margin['right']
    chart_height = height - margin['top'] - margin['bottom']

    # Calculate scale
    max_value = max(data) * 1.2  # 20% headroom
    bar_width = chart_width / len(data) * 0.7
    bar_gap = chart_width / len(data) * 0.3

    # Colors
    colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4']

    # Generate SVG
    svg = f'<svg viewBox="0 0 {width} {height}" class="chart bar-chart">\n'

    # Add styles
    svg += '''<style>
        .chart .axis { stroke: #ccc; stroke-width: 1; }
        .chart .axis-label { font-size: 12px; fill: #666; }
        .chart .bar { transition: opacity 0.2s; }
        .chart .bar:hover { opacity: 0.8; }
        .chart .value-label { font-size: 14px; font-weight: 600; fill: #333; }
        .chart .label-text { font-size: 12px; fill: #666; }
        .chart .grid-line { stroke: #eee; stroke-width: 1; }
    </style>\n'''

    svg += f'<g transform="translate({margin["left"]},{margin["top"]})">\n'

    # Grid lines
    for i in range(5):
        y = chart_height - (i / 4) * chart_height
        value = (i / 4) * max_value
        svg += f'<line class="grid-line" x1="0" y1="{y}" x2="{chart_width}" y2="{y}"/>\n'
        svg += f'<text class="axis-label" x="-10" y="{y+4}" text-anchor="end">{value:.0f}</text>\n'

    # Bars
    for i, (label, value) in enumerate(zip(labels, data)):
        x = i * (bar_width + bar_gap) + bar_gap / 2
        bar_height = (value / max_value) * chart_height
        y = chart_height - bar_height
        color = colors[i % len(colors)]

        # Bar
        svg += f'<rect class="bar" x="{x}" y="{y}" width="{bar_width}" height="{bar_height}" fill="{color}" rx="4"/>\n'

        # Value label
        svg += f'<text class="value-label" x="{x + bar_width/2}" y="{y-8}" text-anchor="middle">{value}</text>\n'

        # X-axis label
        svg += f'<text class="label-text" x="{x + bar_width/2}" y="{chart_height+20}" text-anchor="middle">{label}</text>\n'

    svg += '</g>\n'
    svg += '</svg>'

    return svg


def generate_line_chart(chart_data, width=600, height=400):
    """Generate a line chart SVG.

    Args:
        chart_data: Same format as generate_bar_chart
        width: SVG width in pixels
        height: SVG height in pixels

    Returns:
        SVG string
    """
    if not chart_data or not chart_data.get('datasets'):
        return ''

    labels = chart_data.get('labels', [])
    data = chart_data['datasets'][0].get('data', [])

    if not labels or not data:
        return ''

    margin = {'top': 40, 'right': 30, 'bottom': 60, 'left': 60}
    chart_width = width - margin['left'] - margin['right']
    chart_height = height - margin['top'] - margin['bottom']

    max_value = max(data) * 1.2
    min_value = min(data) * 0.8 if min(data) > 0 else 0

    # Colors
    line_color = '#6366f1'
    point_color = '#4f46e5'

    svg = f'<svg viewBox="0 0 {width} {height}" class="chart line-chart">\n'
    svg += '''<style>
        .chart .axis { stroke: #ccc; stroke-width: 1; }
        .chart .axis-label { font-size: 12px; fill: #666; }
        .chart .line { fill: none; stroke-width: 2; }
        .chart .point { transition: r 0.2s; }
        .chart .point:hover { r: 6; }
        .chart .grid-line { stroke: #eee; stroke-width: 1; }
    </style>\n'''

    svg += f'<g transform="translate({margin["left"]},{margin["top"]})">\n'

    # Grid lines and Y-axis labels
    for i in range(5):
        y = chart_height - (i / 4) * chart_height
        value = min_value + (i / 4) * (max_value - min_value)
        svg += f'<line class="grid-line" x1="0" y1="{y}" x2="{chart_width}" y2="{y}"/>\n'
        svg += f'<text class="axis-label" x="-10" y="{y+4}" text-anchor="end">{value:.0f}</text>\n'

    # Calculate point positions
    points = []
    x_step = chart_width / (len(data) - 1) if len(data) > 1 else chart_width

    for i, value in enumerate(data):
        x = i * x_step
        y = chart_height - ((value - min_value) / (max_value - min_value)) * chart_height
        points.append((x, y))

    # Draw line
    path_d = ' '.join([f'L {x} {y}' if i > 0 else f'M {x} {y}' for i, (x, y) in enumerate(points)])
    svg += f'<path class="line" d="{path_d}" stroke="{line_color}"/>\n'

    # Draw points
    for i, (x, y) in enumerate(points):
        svg += f'<circle class="point" cx="{x}" cy="{y}" r="4" fill="{point_color}"/>\n'
        svg += f'<text class="label-text" x="{x}" y="{chart_height+20}" text-anchor="middle">{labels[i]}</text>\n'

    svg += '</g>\n'
    svg += '</svg>'

    return svg


def generate_pie_chart(chart_data, width=400, height=400):
    """Generate a pie chart SVG.

    Args:
        chart_data: Same format as generate_bar_chart
        width: SVG width in pixels
        height: SVG height in pixels

    Returns:
        SVG string
    """
    if not chart_data or not chart_data.get('datasets'):
        return ''

    labels = chart_data.get('labels', [])
    data = chart_data['datasets'][0].get('data', [])

    if not labels or not data:
        return ''

    total = sum(data)
    center_x = width / 2
    center_y = height / 2
    radius = min(width, height) / 2 - 60

    colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#f43f5e', '#14b8a6']

    svg = f'<svg viewBox="0 0 {width} {height}" class="chart pie-chart">\n'
    svg += '''<style>
        .chart .slice { transition: transform 0.2s; }
        .chart .slice:hover { transform: scale(1.05); }
        .chart .label-text { font-size: 12px; fill: #666; }
        .chart .value-label { font-size: 14px; font-weight: 600; fill: #333; }
    </style>\n'''

    svg += f'<g transform="translate({center_x},{center_y})">\n'

    start_angle = 0

    for i, (label, value) in enumerate(zip(labels, data)):
        angle = (value / total) * 2 * math.pi
        end_angle = start_angle + angle

        # Calculate sector path
        x1 = radius * math.cos(start_angle)
        y1 = radius * math.sin(start_angle)
        x2 = radius * math.cos(end_angle)
        y2 = radius * math.sin(end_angle)

        large_arc = 1 if angle > math.pi else 0

        path_d = f'M 0 0 L {x1} {y1} A {radius} {radius} 0 {large_arc} 1 {x2} {y2} Z'
        color = colors[i % len(colors)]

        svg += f'<path class="slice" d="{path_d}" fill="{color}" stroke="white" stroke-width="2"/>\n'

        # Label position (center of sector)
        mid_angle = start_angle + angle / 2
        label_x = (radius + 30) * math.cos(mid_angle)
        label_y = (radius + 30) * math.sin(mid_angle)

        percentage = (value / total) * 100
        anchor = 'start' if label_x > 0 else 'end'
        svg += f'<text class="label-text" x="{label_x}" y="{label_y}" text-anchor="{anchor}">{label} ({percentage:.1f}%)</text>\n'

        start_angle = end_angle

    svg += '</g>\n'
    svg += '</svg>'

    return svg


def generate_chart_html(chart_data, chart_type='auto'):
    """Generate chart HTML based on data type.

    Automatically selects chart type if not specified.

    Args:
        chart_data: Same format as other chart functions
        chart_type: 'auto', 'bar', 'line', or 'pie'

    Returns:
        HTML string containing SVG chart. Empty string if invalid data.
    """
    if not chart_data:
        return ''

    # Auto-select chart type
    if chart_type == 'auto':
        labels = chart_data.get('labels', [])
        if len(labels) <= 6:
            chart_type = 'bar'
        elif len(labels) <= 10:
            chart_type = 'line'
        else:
            chart_type = 'bar'

    # Generate chart
    if chart_type == 'bar':
        svg = generate_bar_chart(chart_data)
    elif chart_type == 'line':
        svg = generate_line_chart(chart_data)
    elif chart_type == 'pie':
        svg = generate_pie_chart(chart_data)
    else:
        svg = generate_bar_chart(chart_data)

    return f'<div class="chart-container">{svg}</div>'


def add_chart_styles():
    """Return CSS styles for charts.

    Returns:
        CSS string containing chart styles
    """
    return '''
    /* Chart container */
    .chart-container {
        width: 100%;
        max-width: 800px;
        margin: 2rem auto;
        padding: 1rem;
        background: var(--bg-secondary, #fafafa);
        border-radius: var(--border-radius, 8px);
        overflow: hidden;
    }

    /* Chart base styles */
    .chart {
        width: 100%;
        height: auto;
    }

    /* Bar chart */
    .bar-chart .bar {
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1));
    }

    /* Line chart */
    .line-chart .line {
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
    }

    /* Pie chart */
    .pie-chart .slice {
        cursor: pointer;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .chart-container {
            padding: 0.5rem;
        }
    }
    '''


def main():
    """Run demo/test output."""
    test_data = {
        'labels': ['Tencent', 'Alibaba', 'ByteDance', 'Baidu', 'Zhipu', 'Moonshot'],
        'datasets': [{'label': 'Product Count', 'data': [5, 3, 1, 2, 1, 1]}]
    }

    print("Bar Chart:")
    print(generate_bar_chart(test_data))
    print("\n\nLine Chart:")
    print(generate_line_chart(test_data))


if __name__ == '__main__':
    main()
