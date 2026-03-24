# 公文格式模板 (GB/T 9704-2012)

## 格式规范

```
页面：A4, 上 37mm 下 35mm 左 28mm 右 26mm
标题：方正小标宋，22pt，居中
一级标题：黑体，16pt, "一、"
二级标题：楷体，16pt, "（一）"
三级标题：仿宋，16pt, "1."
正文：仿宋，16pt，首行缩进 2 字符，行距固定值 28pt
```

## 使用示例

```javascript
const doc = new Document({
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 2084, right: 1474, bottom: 1984, left: 1587 } // 37/26/35/28mm
      }
    },
    children: [
      new Paragraph({
        children: [new TextRun({ text: "关于 XXX 的通知", font: "方正小标宋", size: 32, bold: true })],
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [new TextRun({ text: "一、总体要求", font: "黑体", size: 26, bold: true })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "    正文内容...", font: "仿宋", size: 24 })]
      })
    ]
  }]
});
```

## 序号层级

```
一、
（一）
1.
（1）
```
