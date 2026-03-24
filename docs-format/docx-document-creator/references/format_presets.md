# 格式预设参考

## 学术论文格式 (academic)

```yaml
page:
  size: A4  # 11906 x 16838 DXA
  margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }  # 25mm

title:
  font: 黑体
  size: 26  # 18pt
  bold: true
  alignment: CENTER

heading1:
  font: 黑体
  size: 22  # 15pt
  bold: true
  numbering: "1"

heading2:
  font: 黑体
  size: 20  # 14pt
  bold: true
  numbering: "1.1"

body:
  font: "宋体"
  eastAsia: "宋体"
  ascii: "Times New Roman"
  size: 18  # 12pt
  firstLineIndent: 2chars
  lineSpacing: 1.5倍

citation:
  style: IEEE
  format: "[1]"
```

## 公文格式 (official)

```yaml
page:
  size: A4
  margin:
    top: 2084    # 37mm
    bottom: 1984 # 35mm
    left: 1587   # 28mm
    right: 1474  # 26mm

title:
  font: 方正小标宋
  size: 32  # 22pt
  bold: true
  alignment: CENTER

heading1:
  font: 黑体
  size: 24  # 16pt
  numbering: "一、"

heading2:
  font: 楷体
  size: 24  # 16pt
  numbering: "（一）"

body:
  font: 仿宋
  size: 24  # 16pt
  firstLineIndent: 2chars
  lineSpacing: 固定值 28pt
```

## 双栏论文格式 (double_column)

```yaml
page:
  size: A4
  margin: { top: 1440, bottom: 1440, left: 1134, right: 1134 }  # 25/25/20/20mm

columns:
  num: 2
  width: 4677  # 82mm
  spacing: 340 # 6mm

body:
  font: "Times New Roman"
  size: 14  # 10pt

title:
  font: "Arial"
  size: 34  # 24pt
  bold: true

heading1:
  font: "Arial"
  size: 17  # 12pt
  bold: true
  case: UPPER
  numbering: "1."
```

## 常用 DXA 换算

```
1 英寸 = 1440 DXA
1 毫米 ≈ 56.7 DXA

字号对照:
  初号 = 42pt = 60480/80 = 60480 half-points
  小初 = 36pt
  一号 = 26pt
  小一 = 24pt
  二号 = 22pt
  小二 = 18pt
  三号 = 16pt
  小三 = 15pt
  四号 = 14pt
  小四 = 12pt
  五号 = 10.5pt
```
