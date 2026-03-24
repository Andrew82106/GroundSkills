# 故障排查指南

## 常见问题

### 1. 验证失败

**症状**: `validate.py` 报告错误

**可能原因**:
- XML 格式错误
- 元素顺序不正确
- RSID 格式无效

**解决**:
```bash
# pack.py 会自动修复大部分问题
python scripts/office/pack.py unpacked/ output.docx --original document.docx

# 如果 still fails，检查 document.xml
# 确保元素顺序：pStyle → numPr → spacing → ind → jc → rPr
```

### 2. 表格渲染异常

**症状**: 表格列宽不正确或显示黑色背景

**解决**:
```javascript
// 必须同时设置表宽和列宽
new Table({
  width: { size: 9360, type: WidthType.DXA },  // 表宽
  columnWidths: [4680, 4680],                   // 列宽和=表宽
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 4680, type: WidthType.DXA },  // 单元格宽
          shading: { type: ShadingType.CLEAR }  // 用 CLEAR 不用 SOLID
        })
      ]
    })
  ]
})
```

### 3. 列表不连续

**症状**: 两个列表各自从 1 开始

**原因**: 使用了相同的 reference

**解决**:
```javascript
// 每个独立的列表用不同的 reference
numbering: {
  config: [
    { reference: "list1", levels: [...] },
    { reference: "list2", levels: [...] }
  ]
}
```

### 4. TOC 不显示章节

**症状**: 目录生成但不包含某些标题

**检查**:
1. 标题必须使用 `HeadingLevel.HEADING_1/2/3`
2. 样式必须包含 `outlineLevel`
3. 不能用自定义样式替代内置 Heading

```javascript
// 正确
new Paragraph({
  heading: HeadingLevel.HEADING_1,
  // 不要加 custom style
})

// 样式定义
{ id: "Heading1", run: {...}, paragraph: { outlineLevel: 0 } }
```

### 5. 字体不显示

**症状**: 文档显示默认字体

**原因**: 系统未安装指定字体

**解决**:
- 使用通用字体：Arial, Times New Roman, Calibri
- 中文字体需要系统安装：宋体、黑体、仿宋、楷体
- 在 `styles.default` 中设置回退字体

### 6. 图片不显示

**症状**: 图片位置显示红叉或空白

**检查**:
1. ImageRun 必须有 `type` 参数
2. 图片文件必须在 `word/media/` 目录
3. 关系 ID 必须正确

```javascript
// 正确
new ImageRun({
  type: "png",  // 必需！
  data: fs.readFileSync("image.png"),
  transformation: { width: 200, height: 150 }
})
```

### 7. 分页符无效

**症状**: PageBreak 不生效

**原因**: PageBreak 必须在 Paragraph 内

```javascript
// 正确
new Paragraph({ children: [new PageBreak()] })

// 错误 - 单独使用
new PageBreak()  // 会生成无效 XML
```

### 8. 标点修复后格式丢失

**症状**: 运行 punctuation.py 后粗体/斜体消失

**原因**: 脚本合并了所有 run

**解决**: 使用 `fix_spacing_simple.py` 保留格式，或手动恢复格式

### 9. 中文显示方框

**症状**: 中文字符显示为方框或乱码

**原因**: 字体不支持中文

**解决**:
```javascript
// 设置正确的字体
styles: {
  default: {
    document: {
      run: {
        font: "Arial",      // 西文
        eastAsia: "微软雅黑"  // 中文
      }
    }
  }
}
```

### 10. 文档过大

**症状**: 生成文件超过 10MB

**解决**:
1. 压缩图片：降低 DPI 到 150
2. 移除未使用的样式
3. 接受所有修订后重新保存
4. 使用 `pack.py` 的压缩选项

## 诊断命令

```bash
# 检查文档结构
python scripts/office/unpack.py input.docx debug/
ls -la debug/word/

# 验证文档
python scripts/office/validate.py output.docx

# 检查修订
python scripts/accept_changes.py input.docx checked.docx

# 检查填充字段（PDF 表单）
python scripts/pdf/check_fillable_fields.py form.pdf
```

## 获取帮助

1. 查看 `references/xml_reference.md` 了解 XML 格式
2. 查看 `references/format_presets.md` 了解格式参数
3. 运行 `analyzer.py` 诊断文档问题
