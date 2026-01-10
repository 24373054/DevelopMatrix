# Security Setup Guide

## API Key Management

### Setting Up DeepSeek API Key

1. **Get Your API Key**
   - Visit: https://platform.deepseek.com/
   - Sign up or log in
   - Navigate to API Keys section
   - Create a new API key

2. **Configure Environment Variables**

   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Edit .env.local and add your actual API key
   nano .env.local  # or use your preferred editor
   ```

3. **Your `.env.local` should look like:**

   ```bash
   DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   DEEPSEEK_API_BASE=https://api.deepseek.com/v1
   ```

### Security Best Practices

#### ✅ DO:
- Store API keys in `.env.local` only
- Keep `.env.local` in `.gitignore` (already configured)
- Use different API keys for development and production
- Rotate API keys regularly
- Set API key usage limits on the DeepSeek platform
- Monitor API usage for unusual activity

#### ❌ DON'T:
- Never commit `.env.local` to git
- Never hardcode API keys in source code
- Never share API keys in documentation
- Never expose API keys in client-side code
- Never include API keys in error messages or logs

### Verifying Security

Check that your API key is secure:

```bash
# Verify .env.local is in .gitignore
git check-ignore .env.local
# Should output: .env.local

# Verify .env.local is not tracked by git
git status --ignored | grep .env.local
# Should show .env.local as ignored

# Verify no API keys in tracked files
git grep -i "sk-" -- ':!.env.local'
# Should return nothing
```

### Environment Variables in Production

For production deployment:

1. **Vercel/Netlify**
   - Add environment variables in the dashboard
   - Never commit production keys to git

2. **Docker**
   ```bash
   docker run -e DEEPSEEK_API_KEY=your-key-here ...
   ```

3. **Kubernetes**
   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: api-keys
   type: Opaque
   data:
     deepseek-api-key: <base64-encoded-key>
   ```

### API Key Rotation

If your API key is compromised:

1. **Immediately revoke** the old key on DeepSeek platform
2. **Generate** a new API key
3. **Update** `.env.local` with the new key
4. **Restart** your development server
5. **Update** production environment variables

### Monitoring

Monitor your API usage:
- Check DeepSeek dashboard regularly
- Set up usage alerts
- Review API logs for suspicious activity
- Track costs and usage patterns

### Emergency Response

If you accidentally commit an API key:

1. **Revoke the key immediately** on DeepSeek platform
2. **Remove from git history**:
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   git filter-repo --invert-paths --path .env.local
   ```
3. **Generate a new key**
4. **Force push** (if necessary and safe):
   ```bash
   git push --force
   ```
5. **Notify team members** to pull the cleaned history

### Additional Security Measures

1. **Rate Limiting**
   - Implement rate limiting in your application
   - Set reasonable token limits per request

2. **Error Handling**
   - Never expose API keys in error messages
   - Log errors securely without sensitive data

3. **Access Control**
   - Limit who has access to production environment variables
   - Use role-based access control (RBAC)

4. **Audit Trail**
   - Keep logs of API key usage
   - Monitor for unauthorized access attempts

### Testing Security

Run security checks:

```bash
# Check for exposed secrets
npm install -g detect-secrets
detect-secrets scan

# Check dependencies for vulnerabilities
npm audit

# Check for hardcoded secrets
git secrets --scan
```

### Support

If you suspect a security issue:
- Contact DeepSeek support immediately
- Revoke compromised keys
- Review access logs
- Update security measures

---

**Remember**: Security is everyone's responsibility. Always follow best practices and never compromise on API key safety.
