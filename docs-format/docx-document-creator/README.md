# docx-document-creator

专业的 Word 文档创建与格式化工具，集成三套引擎：
- **docx-js** - 从零创建 Word 文档
- **XML 直接编辑** - 支持追踪修订和评论
- **Python 脚本** - 格式诊断、标点修复、批量格式化

## 快速开始

### 格式诊断

```bash
uv run --with python-docx python3 scripts/analyzer.py input.docx
```

### 修复标点

```bash
uv run --with python-docx python3 scripts/punctuation.py input.docx output.docx
```

### 应用格式

```bash
# 学术论文格式
uv run --with python-docx python3 scripts/formatter.py input.docx output.docx --preset academic

# 公文格式
uv run --with python-docx python3 scripts/formatter.py input.docx output.docx --preset official
```

### 创建新文档

```javascript
// 使用 docx-js
npm install -g docx
node create_doc.js
```

### 深度编辑（带修订）

```bash
# 解包
python scripts/office/unpack.py document.docx unpacked/

# 编辑 XML（使用 Edit 工具）

# 打包
python scripts/office/pack.py unpacked/ output.docx
```

## 目录结构

```
docx-document-creator/
├── SKILL.md                 # 主文档
├── README.md                # 本文件
├── scripts/
│   ├── analyzer.py          # 格式诊断
│   ├── punctuation.py       # 标点修复
│   ├── formatter.py         # 格式统一
│   └── office/              # XML 编辑工具
├── templates/
│   ├── academic_paper.md    # 学术论文模板
│   ├── official_document.md # 公文模板
│   └── legal_document.md    # 法律文书模板
└── references/
    ├── format_presets.md    # 格式参数参考
    ├── xml_reference.md     # XML 编辑指南
    └── troubleshooting.md   # 故障排查
```

## 格式预设

| 预设 | 说明 | 命令 |
|------|------|------|
| academic | 学术论文 | `--preset academic` |
| official | 公文 (GB/T 9704-2012) | `--preset official` |
| legal | 法律文书 | `--preset legal` |
| double_column | 双栏论文 | `--preset double_column` |

## 依赖

- Python 3.8+
- python-docx
- Node.js (可选，用于创建文档)
- docx (可选，`npm install -g docx`)

## 使用方法

详细用法见 [SKILL.md](SKILL.md)

## License

Apache-2.0
