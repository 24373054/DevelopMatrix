/**
 * 百度搜索资源平台 - 主动推送脚本
 * 
 * 使用方法：
 * 1. 在百度搜索资源平台获取推送接口的 token
 * 2. 设置环境变量：export BAIDU_PUSH_TOKEN="your-token"
 * 3. 运行：node scripts/submit-to-baidu.js
 */

const https = require('https');

// 需要推送的 URL 列表
const urls = [
  'https://develop.matrixlab.work/zh',
  'https://develop.matrixlab.work/en',
  'https://develop.matrixlab.work/zh/blog',
  'https://develop.matrixlab.work/en/blog',
  'https://develop.matrixlab.work/zh/blog/benign-arbitrage-theory',
  'https://develop.matrixlab.work/zh/blog/web3-security-trends-2025',
  'https://develop.matrixlab.work/zh/blog/smart-contract-audit-guide',
  'https://develop.matrixlab.work/zh/blog/defi-risk-management',
  'https://develop.matrixlab.work/zh/products/trace',
  'https://develop.matrixlab.work/zh/products/exchange',
  'https://develop.matrixlab.work/zh/products/game',
  'https://develop.matrixlab.work/zh/developers',
  'https://develop.matrixlab.work/zh/developer',
  'https://develop.matrixlab.work/en/products/trace',
  'https://develop.matrixlab.work/en/products/exchange',
  'https://develop.matrixlab.work/en/products/game',
  'https://develop.matrixlab.work/en/developers',
];

// 从环境变量获取 token
const token = process.env.BAIDU_PUSH_TOKEN;

if (!token) {
  console.error('错误：请设置环境变量 BAIDU_PUSH_TOKEN');
  console.error('获取方式：登录百度搜索资源平台 -> 网站支持 -> 数据引入 -> 链接提交');
  process.exit(1);
}

// 百度推送 API
const apiUrl = `http://data.zz.baidu.com/urls?site=https://develop.matrixlab.work&token=${token}`;

// 准备推送数据
const postData = urls.join('\n');

// 发送推送请求
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('开始向百度推送 URL...');
console.log(`共 ${urls.length} 个 URL`);
console.log('---');

const req = https.request(apiUrl, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('推送完成！');
    console.log('响应：', data);
    
    try {
      const result = JSON.parse(data);
      if (result.success) {
        console.log(`✅ 成功推送 ${result.success} 个 URL`);
      }
      if (result.remain) {
        console.log(`📊 今日剩余推送配额：${result.remain}`);
      }
      if (result.not_same_site && result.not_same_site.length > 0) {
        console.log('⚠️  以下 URL 不属于当前站点：', result.not_same_site);
      }
      if (result.not_valid && result.not_valid.length > 0) {
        console.log('❌ 以下 URL 格式不正确：', result.not_valid);
      }
    } catch (e) {
      console.error('解析响应失败：', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('推送失败：', e.message);
});

req.write(postData);
req.end();
