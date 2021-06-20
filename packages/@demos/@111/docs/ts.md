# TS

## 调试

```json
{
  "type": "node",
  "request": "launch",
  "name": "TS",
  "runtimeExecutable": "node",
  "runtimeArgs": ["-r", "ts-node/register", "-r", "tsconfig-paths/register"],
  "cwd": "${workspaceRoot}",
  "program": "${relativeFile}"
}
```

命令部分表达的意思为：`node -r ts-node/register -r tsconfig-paths/register ${relativeFile}`
