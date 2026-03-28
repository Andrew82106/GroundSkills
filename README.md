# GroundSkills

个人 AI 技能库 — 可复用的 Agent Skills 集合。

## Skills 一览

| Skill | 说明 | 依赖 |
|:---|:---|:---|
| **[detailed-docx](my_skills/detailed-docx/SKILL.md)** | Word 文档精细操作。支持创建、读取、编辑、删除，保留原有格式（字体/颜色/图片/合并单元格），含跨 Run 替换和增量格式叠加。 | `python-docx` |
| **[sci-group-read](my_skills/sci-group-read/SKILL.md)** | 学术论文系统化分析。4 阶段流水线：PDF 解析 → 结构化提取 → 单篇深度分析 → 跨论文领域综述。 | `PyPDF2` `pdfplumber` `PyMuPDF` |
| **[html-presentation](my_skills/html-presentation-skill/SKILL.md)** | HTML 演示文稿生成。从 Markdown 或主题快速生成精美的 HTML 幻灯片。 | `Python 3.8+` |
| **[document-format-skills](my_skills/document-format-skills-main/SKILL.md)** | 文档格式处理。格式诊断、标点修复、样式统一，输入杂乱文档输出规范 docx。 | — |

## 使用方式

每个 Skill 目录下的 `SKILL.md` 包含完整的使用指南。AI Agent 会自动识别并加载相关 Skill。

## 目录结构

```
SKILLS/
├── my_skills/
│   ├── detailed-docx/              # Word 文档精细操作
│   ├── sci-group-read/             # 学术论文分析
│   ├── html-presentation-skill/    # HTML 幻灯片生成
│   └── document-format-skills-main/ # 文档格式处理
├── skills_documents/               # Skills 规范文档
└── README.md
```

## License

Apache-2.0
