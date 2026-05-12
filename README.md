# GroundSkills

个人 AI 技能库 — 可复用的 Agent Skills 集合。

## Skills 一览

| Skill | 说明 | 依赖 |
|:---|:---|:---|
| **[detailed-docx](my_skills/detailed-docx/SKILL.md)** | Word 文档精细操作。支持创建、读取、编辑、删除，保留原有格式（字体/颜色/图片/合并单元格），含跨 Run 替换、增量格式叠加、分栏布局、三线表、LaTeX 公式（含编号公式）及表格单元格公式插入。公式引擎支持 pandoc / latex2mathml 双路径，覆盖双栏论文投稿全场景。 | `python-docx` `pandoc`（推荐） |
| **[sci-group-read](my_skills/sci-group-read/SKILL.md)** | 学术论文系统化分析。4 阶段流水线：PDF 解析 → 结构化提取 → 单篇深度分析 → 跨论文领域综述。 | `PyPDF2` `pdfplumber` `PyMuPDF` |
| **[html-presentation](my_skills/html-presentation-skill/SKILL.md)** | HTML 演示文稿生成。从 Markdown 或主题快速生成精美的 HTML 幻灯片。 | `Python 3.8+` |
| **[document-format-skills](my_skills/document-format-skills-main/SKILL.md)** | 文档格式处理。格式诊断、标点修复、样式统一，输入杂乱文档输出规范 docx。 | — |
| **[lightread-cli](my_skills/lightread-cli/SKILL.md)** | LightRead CLI (`lr`) 集成。支持学术文献搜索、网页读取、资料库管理、笔记库维护及自动引用生成。 | `Node.js` |
| **[my-paper-polish-skills](my_skills/my-paper-polish-skills/SKILL.md)** | 学术论文精修与 LaTeX 辅助。执行无粗体/无冒号/无括注/禁忌短语等硬规则，含一致性自检、表格溢出防护、编辑启发式扫描及 Skill 自更新循环；支持句段润色、全节重写和纯审阅三种响应模式。 | — |
| **[scientific-visualization](my_skills/scientific-visualization/SKILL.md)** | 出版物级别的科学可视化生成。自动化绘制多子图、误差线及色盲友好的多维统计矢量图表。 | `matplotlib` `seaborn` `plotly` |
| **[skill-creator](my_skills/skill-creator/SKILL.md)** | Agent Skill 辅助开发与闭环评测工具。用来创建 Skill，通过验证集评测和提示词跑分以优化效果。 | `Python 3` |
| **[ultimate-scientific-research](my_skills/ultimate-scientific-research/SKILL.md)** | 全流程科研统帅引擎。覆盖 Idea 发掘（六顶帽辩论）→ 文献综述 → 实验设计 → 实验执行 → 论文撰写，含上下文熔断接力与动态 Skill 扫描。 | `Python 3` |

## 使用方式

每个 Skill 目录下的 `SKILL.md` 包含完整的使用指南。AI Agent 会自动识别并加载相关 Skill。

## 目录结构

```
SKILLS/
├── my_skills/
│   ├── detailed-docx/              # Word 文档精细操作（含公式/分栏/三线表）
│   ├── sci-group-read/             # 学术论文分析
│   ├── html-presentation-skill/    # HTML 幻灯片生成
│   ├── document-format-skills-main/ # 文档格式处理
│   ├── lightread-cli/              # LightRead 命令行集成
│   ├── my-paper-polish-skills/     # 论文润色与 LaTeX 撰写
│   ├── scientific-visualization/   # 出版级科学数据可视化
│   ├── skill-creator/              # Skill 开发与评测工具
│   ├── ultimate-scientific-research/ # 全流程科研统帅引擎
│   └── side/                       # 当前在研项目工作区
└── README.md
```

## 更新日志

### 2026-05-12
- **detailed-docx**：新增 `add_equation_with_number()`（公式 + 编号一键排版，底层用无边框 1×2 表格）、`add_equation_to_table_cell()`；公式引擎升级为 pandoc 优先三级降级链，返回值新增 `engine` 字段；补充《模板装配陷阱》一节，覆盖双栏宽度计算、多级列表命名样式、LaTeX raw string、PDF 图片转换等真实投稿踩坑。

### 2026-05-10
- **my-paper-polish-skills**：新增《Skill 自更新循环》机制（每次修稿后同步更新 Skill）；补充《一致性自检》清单（方法名/缩写/表格数据/数据集规模同步要求）；完善响应模式分类（小段落 / 节级重写 / 纯审阅）；新增《编辑启发式扫描》与《技术内容安全防护》两节。

### 2026-04-xx（历史）
- 初始化 9 个核心 Skills：detailed-docx、sci-group-read、html-presentation、document-format-skills、lightread-cli、my-paper-polish-skills、scientific-visualization、skill-creator、ultimate-scientific-research。

## License

Apache-2.0
