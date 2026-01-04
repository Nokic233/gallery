import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    // 设置 base 为仓库名称，用于 GitHub Pages 部署
    // 如果部署到 https://<USERNAME>.github.io/<REPO>/
    base: '/gallery/',
});
