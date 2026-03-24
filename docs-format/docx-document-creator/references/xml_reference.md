# XML 编辑参考

## 文档结构

`.docx` 文件是 ZIP 压缩包，包含：
```
document.docx/
├── [Content_Types].xml
├── _rels/.rels
├── word/
│   ├── document.xml          # 主文档内容
│   ├── _rels/document.xml.rels
│   ├── styles.xml            # 样式定义
│   ├── numbering.xml         # 编号定义
│   ├── header1.xml           # 页眉
│   ├── footer1.xml           # 页脚
│   └── media/                # 图片
```

## 解包与打包

```bash
# 解包
python scripts/office/unpack.py document.docx unpacked/

# 编辑 XML...

# 打包（带自动修复）
python scripts/office/pack.py unpacked/ output.docx --original document.docx

# 验证
python scripts/office/validate.py output.docx
```

## 追踪修订

### 插入文本

```xml
<w:ins w:id="1" w:author="Claude" w:date="2025-01-01T12:00:00Z">
  <w:r>
    <w:rPr>
      <w:b/>  <!-- 加粗显示插入 -->
    </w:rPr>
    <w:t>inserted text</w:t>
  </w:r>
</w:ins>
```

### 删除文本

```xml
<w:del w:id="2" w:author="Claude" w:date="2025-01-01T12:00:00Z">
  <w:r>
    <w:delText>deleted text</w:delText>
  </w:r>
</w:del>
```

### 最小化修订（只改数字）

```xml
<!-- 将 "30 days" 改为 "60 days" -->
<w:r><w:t>The term is </w:t></w:r>
<w:del w:id="1" w:author="Claude" w:date="...">
  <w:r><w:delText>30</w:delText></w:r>
</w:del>
<w:ins w:id="2" w:author="Claude" w:date="...">
  <w:r><w:t>60</w:t></w:r>
</w:ins>
<w:r><w:t> days.</w:t></w:r>
```

### 删除整个段落

```xml
<w:p>
  <w:pPr>
    <w:rPr>
      <w:del w:id="1" w:author="Claude" w:date="..."/>
    </w:rPr>
  </w:pPr>
  <w:del w:id="2" w:author="Claude" w:date="...">
    <w:r><w:delText>Entire paragraph</w:delText></w:r>
  </w:del>
</w:p>
```

## 评论

### 添加评论标记

```bash
# 运行脚本添加评论
python scripts/comment.py unpacked/ 0 "这是评论内容"
```

### 手动添加标记（脚本之后）

```xml
<!-- 评论范围开始 -->
<w:commentRangeStart w:id="0"/>
<!-- 被评论的文本 -->
<w:r><w:t>需要评论的文本</w:t></w:r>
<!-- 评论范围结束 -->
<w:commentRangeEnd w:id="0"/>
<!-- 评论引用标记 -->
<w:r>
  <w:rPr><w:rStyle w:val="CommentReference"/></w:rPr>
  <w:commentReference w:id="0"/>
</w:r>
```

### 回复评论

```xml
<!-- 父评论 0 包含子评论 1 -->
<w:commentRangeStart w:id="0"/>
  <w:commentRangeStart w:id="1"/>
  <w:r><w:t>原文本</w:t></w:r>
  <w:commentRangeEnd w:id="1"/>
<w:commentRangeEnd w:id="0"/>
```

## 智能引号

添加新内容时使用 XML 实体：

```xml
<!-- 左双引号 " -->
<w:t>&#x201C;Hello&#x201D;</w:t>

<!-- 右单引号/所有格 ' -->
<w:t>Here&#x2019;s a quote</w:t>
```

| 实体 | 字符 |
|------|------|
| `&#x2018;` | ' 左单引号 |
| `&#x2019;` | ' 右单引号 |
| `&#x201C;` | " 左双引号 |
| `&#x201D;` | " 右双引号 |

## 常见元素

### 段落

```xml
<w:p>
  <w:pPr>
    <w:pStyle w:val="Heading1"/>
    <w:jc w:val="center"/>  <!-- 居中 -->
  </w:pPr>
  <w:r>
    <w:t>段落内容</w:t>
  </w:r>
</w:p>
```

### 表格

```xml
<w:tbl>
  <w:tblPr>
    <w:tblW w:w="9360" w:type="dxa"/>  <!-- 表宽 -->
  </w:tblPr>
  <w:tr>
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="4680" w:type="dxa"/>  <!-- 单元格宽 -->
      </w:tcPr>
      <w:p><w:r><w:t>单元格内容</w:t></w:r></w:p>
    </w:tc>
  </w:tr>
</w:tbl>
```

### 图片

```xml
<w:drawing>
  <wp:inline>
    <wp:extent cx="914400" cy="914400"/>  <!-- EMU: 914400=1 英寸 -->
    <a:graphic>
      <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
        <pic:pic>
          <pic:blipFill>
            <a:blip r:embed="rId5"/>  <!-- 关联到关系 ID -->
          </pic:blipFill>
        </pic:pic>
      </a:graphicData>
    </a:graphic>
  </wp:inline>
</w:drawing>
```

## RSID 规则

- 必须是 8 位十六进制：`00AB1234`
- 每个编辑操作应有唯一 RSID
- 有效范围：`0x00000000` 到 `0x7FFFFFFF`

## 元素顺序

`<w:pPr>` 内元素顺序：
1. `<w:pStyle>`
2. `<w:numPr>`
3. `<w:spacing>`
4. `<w:ind>`
5. `<w:jc>`
6. `<w:rPr>` (必须最后)
