/**
 * 使用 Vite 的 import.meta.glob 特性自动读取 assets/images 目录下的所有图片
 * 这样以后你只需要往该文件夹添加图片，页面就会自动展示
 */

// 读取 assets/images 下的所有图片文件
// eager: true 表示立即导入
const imageModules = import.meta.glob(
    './assets/images/*.{png,jpg,jpeg,webp,avif}',
    {
        eager: true,
    }
);

// 将导入的模块转换为我们需要的数组格式
const luYuxiaoImages = Object.entries(imageModules).map(([path, module]) => {
    // 提取文件名作为标题（例如：lyx_1.jpg -> lyx_1）
    const fileName = path.split('/').pop();
    const title = fileName.split('.').slice(0, -1).join('.');

    return {
        url: module.default || module, // Vite 处理后的图片路径
        title: title,
    };
});

export default luYuxiaoImages;
