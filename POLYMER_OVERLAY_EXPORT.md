# 聚合物 repeat-unit 导出 SVG（手工测试）

用于本地生成若干示例 SVG，肉眼对比 `polymerRepeatUnitStyle` 为 `'none'` 与 `'bracket-n'` 时的差异。**不参与** `npm run test:unit`（该脚本仅写在 `test/manual/` 下）。

## 前置条件

- 已在仓库根目录执行 `npm install`
- 仅在本地调试、截图或更新示例图时使用；提交 PR 时可按需忽略生成的 `readme/polymer-check/` 文件。

## 如何运行

在仓库根目录执行：

```bash
npm exec -- vitest run test/manual/export-polymer-overlay-svg.test.js
```

成功后会写入目录：

`readme/polymer-check/`

包含：

| 文件 | 说明 |
|------|------|
| `01-pmma-none.svg` | 同一 SMILES，`polymerRepeatUnitStyle: 'none'`（显示 `*`） |
| `02-pmma-bracket-n.svg` | 同上，`'bracket-n'`（`[ ]n` + 穿越括号示意线） |
| `03-ester-bracket-n.svg` | `*CC(=O)O*`，尾端 `*` 判定场景 |
| `04-internal-wildcards.svg` | 内部 `*`，应不启用 bracket 模式 |

每个 SVG 文件首行注释中有对应的 SMILES 与 options，便于核对。

## 修改示例

编辑 `test/manual/export-polymer-overlay-svg.test.js` 中的 `figures` 数组：增加 `[文件名, SMILES, 选项对象]` 条目即可。

## 与自动化测试的区别

- **回归测试**：`test/regression/rendering.test.js` 中的聚合物相关用例，随 `npm run test:unit` 运行。
- **本脚本**：只负责写磁盘 SVG，方便浏览器打开对比版式。
