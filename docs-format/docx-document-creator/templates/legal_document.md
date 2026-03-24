# 法律文书模板

## 格式规范

```
页面：A4, 上 30mm 下 25mm 左 30mm 右 25mm
标题：宋体加粗，22pt，居中
条款标题：黑体，14pt, "第一条"
正文：宋体，14pt，首行缩进 2 字符，行距 1.5 倍
```

## 使用示例

```javascript
const doc = new Document({
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1701, right: 1418, bottom: 1418, left: 1701 } // 30/25/25/30mm
      }
    },
    children: [
      new Paragraph({
        children: [new TextRun({ text: "XXX 合同书", font: "宋体", size: 32, bold: true })],
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [new TextRun({ text: "第一条 合同目的", font: "黑体", size: 20, bold: true })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "    本合同由以下双方签订：...", font: "宋体", size: 20 })]
      })
    ]
  }]
});
```

## 条款格式

```
第一条
第二条
...
（一）
（二）
```
