# 学术论文模板

## 格式规范

```
页面：A4, 边距 25mm
标题：黑体，18pt，居中
一级标题：黑体，15pt, "1"
二级标题：黑体，14pt, "1.1"
正文：宋体/Times New Roman, 12pt，首行缩进 2 字符，行距 1.5 倍
引用：IEEE 风格 [1], [2]
```

## 使用示例

```javascript
const { Document, Packer, Paragraph, TextRun, TableOfContents, HeadingLevel } = require('docx');

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal",
        run: { font: "黑体", size: 30, bold: true },
        paragraph: { outlineLevel: 0 } }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new TableOfContents("目录", { headingStyleRange: "1-3", hyperlink: true }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. 引言")] }),
      new Paragraph({ children: [new TextRun("    正文内容...")] })
    ]
  }]
});
```

## 参考文献格式 (IEEE)

```
期刊：[1] 作者."标题，"*期刊名*, vol. x, no. x, pp. xxx-xxx, 月份，年份.
会议：[2] 作者."标题，"*会议名*, 城市，年份，pp. xxx-xxx.
```
