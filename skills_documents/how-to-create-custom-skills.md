# 如何创建自定义 Skills

> 原文链接: https://support.claude.com/en/articles/12512198-how-to-create-custom-skills  
> 更新时间: 一周前

Skills 功能适用于 Free、Pro、Max、Team 和 Enterprise 计划的用户。此功能需要启用代码执行。Skills 目前也以 beta 版本提供给 Claude Code 用户和所有使用代码执行工具的 API 用户。

自定义 Skills 让你能够为 Claude 增强专业知识和工作流程，使其适应你的组织或个人工作风格。本文将介绍如何创建、构建和测试你自己的 Skills。

---

## 什么是好的 Skill？

Skills 可以简单到几行指令，也可以复杂到包含可执行代码的多文件包。最好的 Skills 具有以下特点：

- 解决特定的、可重复的任务
- 有 Claude 可以遵循的清晰指令
- 在有帮助时包含示例
- 定义何时应该使用
- 专注于一个工作流程，而不是试图做所有事情

---

## 创建 Skill.md 文件

每个 Skill 都由一个目录组成，至少包含一个 `Skill.md` 文件，这是 Skill 的核心。该文件必须以 YAML frontmatter 开头，包含 `name` 和 `description` 字段，这些是必需的元数据。它还可以包含额外的元数据、给 Claude 的指令、参考文件、可执行脚本或工具。

### 必需的元数据字段

- **name**: Skill 的友好名称（最多 64 个字符）
  - 示例: `Brand Guidelines`

- **description**: 清晰描述 Skill 的功能和使用时机
  - 这很关键——Claude 使用此描述来决定何时调用你的 Skill（最多 200 个字符）
  - 示例: `Apply Acme Corp brand guidelines to presentations and documents, including official colors, fonts, and logo usage.`

### 可选的元数据字段

- **dependencies**: Skill 所需的软件包
  - 示例: `python>=3.8, pandas>=1.5.0`

Skill.md 文件中的元数据作为渐进式披露系统的第一层，提供足够的信息让 Claude 知道何时应该使用该 Skill，而无需加载所有内容。

### Markdown 正文

Markdown 正文是元数据之后的第二层详细信息，因此如果需要，Claude 会在阅读元数据后访问此内容。根据你的任务，Claude 可以访问 Skill.md 文件并使用该 Skill。

### Skill.md 示例

**品牌指南 Skill**

```markdown
---
name: Brand Guidelines
description: Apply Acme Corp brand guidelines to all presentations and documents
---

## Overview

This Skill provides Acme Corp's official brand guidelines for creating consistent, professional materials. When creating presentations, documents, or marketing materials, apply these standards to ensure all outputs match Acme's visual identity. Claude should reference these guidelines whenever creating external-facing materials or documents that represent Acme Corp.

## Brand Colors

Our official brand colors are:
- Primary: #FF6B35 (Coral)
- Secondary: #004E89 (Navy Blue)
- Accent: #F7B801 (Gold)
- Neutral: #2E2E2E (Charcoal)

## Typography

Headers: Montserrat Bold
Body text: Open Sans Regular

Size guidelines:
- H1: 32pt
- H2: 24pt
- Body: 11pt

## Logo Usage

Always use the full-color logo on light backgrounds. Use the white logo on dark backgrounds. Maintain minimum spacing of 0.5 inches around the logo.

## When to Apply

Apply these guidelines whenever creating:
- PowerPoint presentations
- Word documents for external sharing
- Marketing materials
- Reports for clients

## Resources

See the resources folder for logo files and font downloads.
```

---

## 添加资源文件

如果你有太多信息无法添加到单个 Skill.md 文件中（例如，仅适用于特定场景的部分），你可以通过在 Skill 目录中添加文件来添加更多内容。

例如，在 Skill 目录中添加一个包含补充和参考信息的 `REFERENCE.md` 文件。在 Skill.md 中引用它将帮助 Claude 决定在执行 Skill 时是否需要访问该资源。

---

## 添加脚本

对于更高级的 Skills，可以将可执行代码文件附加到 Skill.md，允许 Claude 运行代码。例如，我们的文档 skills 使用以下编程语言和包：

- Python (pandas, numpy, matplotlib)
- JavaScript/Node.js
- 文件编辑辅助包
- 可视化工具

**注意**: Claude 和 Claude Code 可以在加载 Skills 时从标准仓库（Python PyPI、JavaScript npm）安装包。API Skills 无法在运行时安装额外的包——所有依赖项必须预先安装在容器中。

---

## 打包你的 Skill

完成 Skill 文件夹后：

1. 确保文件夹名称与你的 Skill 名称匹配
2. 创建文件夹的 ZIP 文件
3. ZIP 应该包含 Skill 文件夹作为其根目录（而不是子文件夹）

**正确的结构**:

```
my-skill.zip
  └── my-skill/
      ├── Skill.md
      └── resources/
```

**错误的结构**:

```
my-skill.zip
  └── (文件直接在 ZIP 根目录中)
```

---

## 测试你的 Skill

### 上传前

1. 检查你的 Skill.md 是否清晰
2. 检查描述是否准确反映了 Claude 应该何时使用该 Skill
3. 验证所有引用的文件是否存在于正确的位置
4. 使用示例提示进行测试，确保 Claude 适当地调用它

### 上传到 Claude 后

1. 在 Customize > Skills 中启用该 Skill
2. 尝试几个应该触发它的不同提示
3. 查看 Claude 的思考过程以确认它正在加载该 Skill
4. 如果 Claude 没有在预期时使用它，请迭代描述

**注意**: 对于 Team 和 Enterprise 计划：要使 skill 对组织中的所有用户可用，请参阅"为你的组织配置和管理 Skills"。

---

## 最佳实践

- **保持专注**: 为不同的工作流程创建单独的 Skills。多个专注的 Skills 比一个大型 Skill 更好地组合。

- **编写清晰的描述**: Claude 使用描述来决定何时调用你的 Skill。要具体说明它何时适用。

- **从简单开始**: 在添加复杂脚本之前，先从 Markdown 中的基本指令开始。你以后总是可以扩展 Skill。

- **使用示例**: 在你的 Skill.md 文件中包含示例输入和输出，以帮助 Claude 理解成功是什么样子。

- **增量测试**: 在每次重大更改后进行测试，而不是一次性构建复杂的 Skill。

- **Skills 可以相互构建**: 虽然 Skills 不能显式引用其他 Skills，但 Claude 可以自动一起使用多个 Skills。这种可组合性是 Skills 功能最强大的部分之一。

- **查看开放的 Agent Skills 规范**: 遵循 agentskills.io 的指南，这样你创建的 skills 可以在采用该标准的平台上工作。

有关 skill 创建的更深入指南，请参阅我们 Claude 文档中的"Skill 编写最佳实践"。

---

## 安全注意事项

在将脚本添加到 Skill.md 文件时要谨慎：

- 不要硬编码敏感信息（API 密钥、密码）
- 在启用之前查看你下载的任何 Skills
- 使用适当的 MCP 连接进行外部服务访问

---

## 参考示例 Skills

访问我们在 GitHub 上的仓库，获取可用作模板的示例 Skills:  
https://github.com/anthropics/skills/tree/main/skills
