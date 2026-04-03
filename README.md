# GroundSkills

个人 AI 技能库 — 可复用的 Agent Skills 集合。

## Skills 一览

| Skill | 说明 | 依赖 |
|:---|:---|:---|
| **[detailed-docx](my_skills/detailed-docx/SKILL.md)** | Word 文档精细操作。支持创建、读取、编辑、删除，保留原有格式（字体/颜色/图片/合并单元格），含跨 Run 替换和增量格式叠加。 | `python-docx` |
| **[sci-group-read](my_skills/sci-group-read/SKILL.md)** | 学术论文系统化分析。4 阶段流水线：PDF 解析 → 结构化提取 → 单篇深度分析 → 跨论文领域综述。 | `PyPDF2` `pdfplumber` `PyMuPDF` |
| **[html-presentation](my_skills/html-presentation-skill/SKILL.md)** | HTML 演示文稿生成。从 Markdown 或主题快速生成精美的 HTML 幻灯片。 | `Python 3.8+` |
| **[document-format-skills](my_skills/document-format-skills-main/SKILL.md)** | 文档格式处理。格式诊断、标点修复、样式统一，输入杂乱文档输出规范 docx。 | — |
| **[lightread-cli](my_skills/lightread-cli/SKILL.md)** | LightRead CLI (`lr`) 集成。支持学术文献搜索、网页读取、资料库管理、笔记库维护及自动引用生成。 | `Node.js` |
| **[my-paper-polish-skills](my_skills/my-paper-polish-skills/SKILL.md)** | 学术论文精修与 LaTeX 辅助。改善学术地道表达、消除冗词与优化结构，符合最佳排版标准。 | — |
| **[scientific-visualization](my_skills/scientific-visualization/SKILL.md)** | 出版物级别的科学可视化生成。自动化绘制多子图、误差线及色盲友好的多维统计矢量图表。 | `matplotlib` `seaborn` `plotly` |
| **[skill-creator](my_skills/skill-creator/SKILL.md)** | Agent Skill 辅助开发与闭环评测工具。用来创建 Skill，通过验证集评测和提示词跑分以优化效果。 | `Python 3` |

## 使用方式

每个 Skill 目录下的 `SKILL.md` 包含完整的使用指南。AI Agent 会自动识别并加载相关 Skill。

## 目录结构

```
SKILLS/
├── my_skills/
│   ├── detailed-docx/              # Word 文档精细操作
│   ├── sci-group-read/             # 学术论文分析
│   ├── html-presentation-skill/    # HTML 幻灯片生成
│   ├── document-format-skills-main/ # 文档格式处理
│   ├── lightread-cli/              # LightRead 命令行集成
│   ├── my-paper-polish-skills/     # 论文润色与 LaTeX 撰写
│   ├── scientific-visualization/   # 出版级科学数据可视化
│   └── skill-creator/              # Skill 开发与评测工具
├── skills_documents/               # Skills 规范文档
└── README.md
```

## License

Apache-2.0
