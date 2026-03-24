#!/usr/bin/env node
/**
 * 测试论文创建脚本
 * 使用学术格式创建测试论文
 */

const { Document, Packer, Paragraph, TextRun, TableOfContents, HeadingLevel,
        AlignmentType, LevelFormat, WidthType, ShadingType, BorderStyle,
        Header, Footer, PageNumber } = require('docx');
const fs = require('fs');

console.log("创建测试论文...");

const doc = new Document({
  // 样式定义
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 24 } // 12pt
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "黑体", size: 30, bold: true }, // 15pt
        paragraph: {
          spacing: { before: 240, after: 180 },
          outlineLevel: 0
        }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "黑体", size: 28, bold: true }, // 14pt
        paragraph: {
          spacing: { before: 180, after: 120 },
          outlineLevel: 1
        }
      },
      {
        id: "Abstract",
        name: "Abstract",
        basedOn: "Normal",
        run: { font: "黑体", size: 24, bold: true },
        paragraph: { spacing: { before: 240, after: 120 } }
      }
    ]
  },

  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 25mm
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "人工智能对现代软件工程的影响研究", size: 18 })],
            alignment: AlignmentType.CENTER
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "第 " }),
              new TextRun({ children: [{ pageNumber: "current" }], size: 18 }),
              new TextRun({ text: " 页" })
            ],
            alignment: AlignmentType.CENTER
          })
        ]
      })
    },
    children: [
      // 标题
      new Paragraph({
        children: [
          new TextRun({
            text: "人工智能对现代软件工程的影响研究",
            font: "黑体",
            size: 44, // 22pt
            bold: true
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 360 }
      }),

      // 摘要
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("摘要")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    本文探讨了人工智能在现代软件开发中的变革性作用。我们研究了 AI 驱动工具（如大型语言模型）如何重塑代码生成、调试和项目管理。通过对传统工作流与 AI 增强流程的比较分析，我们证明了开发者生产力和代码质量的显著提升。然而，在安全性、可靠性和伦理方面仍然存在挑战。",
            font: "宋体",
            size: 24 // 12pt
          })
        ],
        spacing: { after: 180 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "关键词：人工智能；软件工程；大型语言模型；代码生成；生产力",
            font: "黑体",
            size: 24
          })
        ],
        spacing: { after: 360 }
      }),

      // 目录
      new TableOfContents("目录", {
        headingStyleRange: "1-3",
        hyperlink: true,
        stylesWithLevels: [
          { style: "Heading1", level: 1 },
          { style: "Heading2", level: 2 }
        ]
      }),
      new Paragraph({ children: [new TextRun({ break: 1 })] }), // 分页

      // 引言
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("1. 引言")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    软件工程在过去几十年中经历了快速发展。从结构化编程到面向对象设计，每次范式转变都带来了新的效率提升。今天，我们正处于另一场革命的边缘：AI 辅助开发 [1]。GitHub Copilot 和 ChatGPT 等工具不仅是助手，更是编码过程中的积极参与者。",
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    本研究旨在量化这些工具对三个关键指标的影响：",
            font: "Times New Roman",
            size: 24
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "    1.  新功能上市时间", font: "Times New Roman", size: 24 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "    2.  生产代码的缺陷密度", font: "Times New Roman", size: 24 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "    3.  开发者满意度和倦怠率", font: "Times New Roman", size: 24 })
        ],
        spacing: { after: 180 }
      }),

      // 研究方法
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("2. 研究方法")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    我们进行了一项对照实验，50 名软件开发人员分为两组：A 组（对照组）使用标准 IDE，B 组（实验组）配备 AI 编码助手。两组都被要求实现具有特定需求的 RESTful API 服务。",
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 180 }
      }),

      // 2.1 参与者
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.1 参与者")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    参与者从不同级别的初级、中级和高级工程师中选出，以确保结果具有代表性。",
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 180 }
      }),

      // 2.2 指标
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.2 指标")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    我们收集了以下数据：",
            font: "Times New Roman",
            size: 24
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "    ·  编码速度：每小时代码行数（LOC）", font: "Times New Roman", size: 24 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "    ·  错误率：代码审查期间发现的语法和逻辑错误数量", font: "Times New Roman", size: 24 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "    ·  系统可用性量表（SUS）：衡量用户对工具的满意度", font: "Times New Roman", size: 24 })
        ],
        spacing: { after: 180 }
      }),

      // 结果
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("3. 结果")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    实验组的生产力显著提高。B 组完成任务的速度比 A 组快 40%。然而，代码审查显示，虽然语法错误减少了，但 AI 生成代码中的微妙逻辑错误更难检测 [2]。",
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 180 }
      }),

      // 讨论
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("4. 讨论")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    将人工智能集成到软件开发生命周期（SDLC）中是一把双刃剑。虽然速度得到了提高，但审查 AI 代码的'认知负荷'不容忽视。开发者必须从代码'作者'转变为'审查者'。",
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 180 }
      }),

      // 伦理考量
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("4.1 伦理考量")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    AI 的使用引发了关于代码所有权和版权的问题 [3]。由在开源代码库上训练的 AI 生成的代码归谁所有？",
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 180 }
      }),

      // 结论
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("5. 结论")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    人工智能无疑正在改变软件工程的格局。为了充分利用其潜力，组织必须采用优先考虑严格代码审查和持续测试的新工作流。未来的研究应侧重于 AI 生成代码库的长期可维护性。",
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 360 }
      }),

      // 参考文献
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("参考文献")]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    [1] Smith, J. (2023). \"The AI Revolution in Coding.\" Journal of Software Tech, 15(2), 112-125.",
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    [2] Doe, A., & Lee, B. (2024). \"Hidden Bugs in LLM-Generated Code.\" Proceedings of ICSE 2024.",
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "    [3] Brown, C. (2022). \"Legal Implications of AI Code generation.\" Tech Law Review, 8(4).",
            font: "Times New Roman",
            size: 24
          })
        ]
      })
    ]
  }]
});

console.log("文档结构创建完成，正在打包...");

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("test_output.docx", buffer);
  console.log("✓ 测试论文已创建：test_output.docx");
  console.log(`  文件大小：${(buffer.length / 1024).toFixed(2)} KB`);
}).catch(err => {
  console.error("创建失败:", err);
  process.exit(1);
});
