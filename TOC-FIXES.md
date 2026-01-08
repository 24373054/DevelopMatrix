# 目录功能修复总结

## 已修复的问题

### 1. ✅ 标题显示问题

**问题：**
标题显示为 `良性套利论：当&ldquo;贪婪&rdquo;成为去中心化世界的稳定器`

**原因：**
使用了 HTML 实体编码（`&ldquo;` 和 `&rdquo;`），在某些情况下不会自动解码

**修复：**
将 HTML 实体改为转义的 JSON 字符串：
```json
"title": "良性套利论：当\"贪婪\"成为去中心化世界的稳定器"
```

现在显示为：`良性套利论：当"贪婪"成为去中心化世界的稳定器`

### 2. ✅ 目录不跟随滚动

**问题：**
- 目录固定在顶部不跟随页面滚动
- 滚动时不会高亮当前阅读的章节
- 点击目录项后页面不滚动

**原因：**
1. IntersectionObserver 配置不够准确
2. 滚动函数计算位置有误
3. 缺少默认激活状态

**修复：**

#### 改进的 IntersectionObserver：
```typescript
observerRef.current = new IntersectionObserver(
  (entries) => {
    const visibleEntries = entries.filter(entry => entry.isIntersecting);
    
    if (visibleEntries.length > 0) {
      // 选择最上面的可见标题
      const topEntry = visibleEntries.reduce((top, entry) => {
        return entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top;
      });
      setActiveId(topEntry.target.id);
    }
  },
  {
    rootMargin: '-80px 0px -80% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  }
);
```

#### 改进的滚动函数：
```typescript
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 100; // 导航栏高度
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
    
    // 立即更新激活状态
    setActiveId(id);
    setTocOpen(false);
  }
};
```

#### 添加默认激活状态：
```typescript
// 设置第一个标题为默认激活
if (headingData.length > 0) {
  setActiveId(headingData[0].id);
}
```

### 3. ✅ 目录样式优化

**改进：**
1. 桌面端目录添加最大高度和滚动：
   ```tsx
   <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
   ```

2. 激活状态使用左侧边框指示器：
   ```tsx
   {activeId === heading.id && (
     <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r" />
   )}
   ```

3. 移动端添加关闭按钮：
   ```tsx
   <button onClick={() => setTocOpen(false)}>✕</button>
   ```

4. 浮动按钮添加 hover 缩放效果：
   ```tsx
   className="... hover:scale-110"
   ```

## 功能特性

### 桌面端：
- ✅ 右侧固定侧边栏
- ✅ 跟随页面滚动
- ✅ 自动高亮当前章节
- ✅ 点击平滑滚动到对应位置
- ✅ 支持多级标题缩进
- ✅ 目录过长时可滚动

### 移动端：
- ✅ 右下角浮动按钮
- ✅ 侧滑抽屉式目录
- ✅ 点击后自动关闭
- ✅ 背景遮罩支持点击关闭
- ✅ 关闭按钮

### 交互体验：
- ✅ 平滑滚动动画
- ✅ 实时高亮当前章节
- ✅ 左侧蓝色指示器
- ✅ Hover 效果
- ✅ 响应式设计

## 技术实现

### IntersectionObserver 配置：
- `rootMargin: '-80px 0px -80% 0px'` - 顶部 80px 偏移，底部 80% 偏移
- `threshold: [0, 0.25, 0.5, 0.75, 1]` - 多个阈值，更精确的检测

### 滚动位置计算：
```typescript
const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
const offsetPosition = elementPosition - headerOffset;
```

### 激活状态管理：
- 使用 `useState` 管理当前激活的标题 ID
- IntersectionObserver 自动更新
- 点击时立即更新

## 测试清单

- [x] 标题正确显示（无 HTML 实体）
- [x] 目录跟随页面滚动
- [x] 滚动时自动高亮当前章节
- [x] 点击目录项平滑滚动
- [x] 桌面端侧边栏正常显示
- [x] 移动端浮动按钮正常工作
- [x] 移动端抽屉动画流畅
- [x] 构建成功无错误

## 使用方法

1. **重启服务器**：
   ```bash
   ./stop-all.sh
   ./start-all.sh
   ```

2. **清除缓存**：
   按 Ctrl+Shift+R 强制刷新浏览器

3. **测试功能**：
   - 访问任意博客文章
   - 滚动页面观察目录高亮
   - 点击目录项测试跳转
   - 在移动端测试浮动按钮

## 浏览器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- 移动浏览器: ✅ 完全支持

## 性能优化

- 使用 IntersectionObserver（性能优于 scroll 事件）
- 使用 useRef 避免不必要的重渲染
- 正确清理 Observer 避免内存泄漏
- CSS 动画使用 GPU 加速

## 已知限制

1. **标题必须是 H2、H3、H4**：其他级别的标题不会被提取
2. **需要 JavaScript**：目录功能依赖客户端 JavaScript
3. **首次加载**：需要等待内容渲染完成才能提取标题

## 未来改进建议

1. **进度条**：显示文章阅读进度
2. **折叠功能**：支持折叠/展开子标题
3. **搜索功能**：在目录中搜索标题
4. **键盘导航**：支持键盘快捷键
5. **打印优化**：打印时隐藏目录
