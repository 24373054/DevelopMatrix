# 🔒 安全检查清单

## API密钥安全

### ✅ 已完成的安全措施

- [x] API密钥存储在 `.env.local`
- [x] `.env.local` 已添加到 `.gitignore`
- [x] 创建了 `.env.example` 作为模板（不含真实密钥）
- [x] 所有文档中移除了真实API密钥
- [x] 代码中没有硬编码的API密钥
- [x] 使用 `dotenv` 安全加载环境变量

### 🔍 验证步骤

运行以下命令确认安全性：

```bash
# 1. 确认 .env.local 被git忽略
git check-ignore .env.local
# 预期输出：.env.local

# 2. 确认 .env.local 未被追踪
git status --ignored | grep .env.local
# 预期输出：.env.local (在ignored列表中)

# 3. 确认没有API密钥在git历史中
git log --all --full-history --source --pretty=format: -- .env.local
# 预期输出：空（.env.local从未被提交）

# 4. 搜索代码中是否有API密钥
git grep -i "sk-" -- ':!.env.local' ':!.env.example'
# 预期输出：空（没有硬编码的密钥）

# 5. 检查文档中是否有真实密钥
grep -r "sk-c23dd2d363044b2aad5788bf3003fc91" . --exclude-dir=node_modules --exclude-dir=.git
# 预期输出：空（所有真实密钥已移除）
```

### 📋 提交前检查清单

在每次提交代码前，确认：

- [ ] `.env.local` 不在暂存区
- [ ] 没有硬编码的API密钥
- [ ] 文档中只有示例密钥（如 `your-api-key-here`）
- [ ] 新增的环境变量已添加到 `.env.example`
- [ ] 敏感信息已从日志中移除

### 🚨 如果不小心提交了API密钥

**立即执行以下步骤：**

1. **撤销密钥**
   - 立即访问 https://platform.deepseek.com/
   - 撤销被泄露的API密钥
   - 生成新的API密钥

2. **清理Git历史**
   ```bash
   # 使用 git-filter-repo（推荐）
   git filter-repo --invert-paths --path .env.local
   
   # 或使用 BFG Repo-Cleaner
   bfg --delete-files .env.local
   ```

3. **更新密钥**
   ```bash
   # 更新 .env.local 为新密钥
   nano .env.local
   ```

4. **强制推送**（如果必要）
   ```bash
   git push --force
   ```

5. **通知团队**
   - 告知所有团队成员
   - 要求重新拉取代码

## 环境变量管理

### 开发环境

```bash
# .env.local（本地开发，不提交）
DEEPSEEK_API_KEY=sk-你的开发环境密钥
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
```

### 生产环境

**Vercel/Netlify:**
- 在平台控制台添加环境变量
- 不要在代码中硬编码

**Docker:**
```bash
docker run -e DEEPSEEK_API_KEY=sk-生产密钥 ...
```

**Kubernetes:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-keys
type: Opaque
data:
  deepseek-api-key: <base64编码的密钥>
```

## 代码审查检查点

在代码审查时，检查：

- [ ] 没有新的硬编码密钥
- [ ] 环境变量正确使用
- [ ] 错误日志不包含敏感信息
- [ ] API调用有适当的错误处理
- [ ] 没有在客户端代码中暴露密钥

## 监控和审计

### 定期检查

**每周：**
- [ ] 检查API使用情况
- [ ] 查看异常访问模式
- [ ] 验证密钥仍然有效

**每月：**
- [ ] 轮换API密钥
- [ ] 审查访问日志
- [ ] 更新安全措施

**每季度：**
- [ ] 全面安全审计
- [ ] 更新依赖包
- [ ] 检查漏洞

### 监控指标

在DeepSeek平台监控：
- API调用次数
- Token使用量
- 错误率
- 异常访问时间

## 最佳实践

### ✅ 应该做的

1. **使用环境变量**
   ```typescript
   const apiKey = process.env.DEEPSEEK_API_KEY;
   ```

2. **验证密钥存在**
   ```typescript
   if (!apiKey) {
     throw new Error('API key not found');
   }
   ```

3. **安全的错误处理**
   ```typescript
   try {
     await api.call();
   } catch (error) {
     console.error('API call failed'); // 不要记录密钥
   }
   ```

4. **限制访问**
   - 只在服务端使用API密钥
   - 不要在客户端代码中引用

### ❌ 不应该做的

1. **硬编码密钥**
   ```typescript
   // ❌ 错误
   const apiKey = 'sk-xxxxx';
   ```

2. **提交密钥文件**
   ```bash
   # ❌ 错误
   git add .env.local
   ```

3. **在日志中记录密钥**
   ```typescript
   // ❌ 错误
   console.log('API Key:', apiKey);
   ```

4. **在客户端使用**
   ```typescript
   // ❌ 错误（客户端代码）
   const apiKey