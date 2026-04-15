#!/usr/bin/env python3
"""
Ultimate Scientific Research — 科研工作区初始化脚手架

使用方式：
    python init_research.py <project_root> [--name <project_name>]

功能：
    在指定路径下创建标准化的科研生命周期目录树，
    并生成初始的 project_state.json 状态文件。
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone


DIRECTORY_TREE = {
    "01_ideas": {
        "_description": "存放想法清单、可行性调研日志（阶段 1 检查点）",
    },
    "02_lit": {
        "_description": "存放文献参考原件 (PDF) 与综述总结文档（阶段 2）",
    },
    "03_planning": {
        "_description": "存放实验设计档案（数据集规划、基线列表及算法伪代码）（阶段 3）",
    },
    "04_experiments": {
        "_description": "核心代码研发区（阶段 4 执行主场）",
        "src": {},
        "data": {},
    },
    "05_results": {
        "_description": "存放出版级图表和评估报表（阶段 4 输出）",
        "figures": {},
    },
    "06_manuscript": {
        "_description": "包含 LaTeX 源码和最终 PDF 论文（阶段 5）",
        "figures": {},
    },
}


def create_tree(base_path: str, tree: dict) -> list[str]:
    """递归创建目录树，返回创建的目录路径列表。"""
    created = []
    for name, subtree in tree.items():
        if name.startswith("_"):
            continue
        dir_path = os.path.join(base_path, name)
        os.makedirs(dir_path, exist_ok=True)
        created.append(dir_path)

        # 如果有 _description，写一个 README.md
        desc = subtree.get("_description")
        if desc:
            readme_path = os.path.join(dir_path, "README.md")
            if not os.path.exists(readme_path):
                with open(readme_path, "w", encoding="utf-8") as f:
                    f.write(f"# {name}\n\n{desc}\n")

        # 递归处理子目录
        sub_dirs = {k: v for k, v in subtree.items() if not k.startswith("_")}
        if sub_dirs:
            created.extend(create_tree(dir_path, sub_dirs))
    return created


def create_project_state(project_root: str, project_name: str) -> str:
    """创建初始 project_state.json，返回文件路径。"""
    state = {
        "current_phase": 1,
        "project_name": project_name,
        "decisions": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    state_path = os.path.join(project_root, "project_state.json")
    with open(state_path, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)
    return state_path


def main():
    parser = argparse.ArgumentParser(
        description="初始化标准科研工作区目录树"
    )
    parser.add_argument(
        "project_root",
        help="科研项目的根目录路径（如不存在会自动创建）",
    )
    parser.add_argument(
        "--name",
        default=None,
        help="项目名称（默认使用目录名）",
    )
    args = parser.parse_args()

    project_root = os.path.abspath(args.project_root)
    project_name = args.name or os.path.basename(project_root)

    # 检查是否已存在 project_state.json（防止误覆盖）
    state_path = os.path.join(project_root, "project_state.json")
    if os.path.exists(state_path):
        print(f"⚠️  {state_path} 已存在。")
        print("   如果需要重新初始化，请先手动删除该文件。")
        sys.exit(1)

    # 创建目录树
    os.makedirs(project_root, exist_ok=True)
    created_dirs = create_tree(project_root, DIRECTORY_TREE)

    # 创建 project_state.json
    state_file = create_project_state(project_root, project_name)

    # 输出结果
    print(f"✅ 科研工作区已初始化: {project_root}")
    print(f"   项目名称: {project_name}")
    print(f"   状态文件: {state_file}")
    print(f"   创建了 {len(created_dirs)} 个目录：")
    for d in created_dirs:
        rel = os.path.relpath(d, project_root)
        print(f"     📁 {rel}/")
    print()
    print("下一步：在对话中 @ultimate-scientific-research 开始阶段 1（寻找 Idea）。")


if __name__ == "__main__":
    main()
