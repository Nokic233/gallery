// 获取所有图片 URL
function getAllImageUrls() {
    const urls = [];
    window.images.forEach(group => {
        const groupUrls = Array.isArray(group.url) ? group.url : [group.url];
        groupUrls.forEach(url => {
            urls.push({
                url,
                title: group.title,
            });
        });
    });
    return urls;
}

const allImages = getAllImageUrls();
const container = document.getElementById('mouse-trail-container');

// 控制图片生成的节流
let lastSpawnTime = 0;
let lastSpawnX = 0;
let lastSpawnY = 0;
let lastImageWidth = 300; // 上一张图片的宽度
let lastImageHeight = 400; // 上一张图片的高度（图片加载后更新）
const SPAWN_INTERVAL = 200; // 时间间隔（毫秒）
const MAX_IMAGES = 50; // 页面上最多保留的图片数量

// 当前图片索引（循环使用）
let currentImageIndex = 0;

// z-index 计数器，从大数开始确保层叠正确
let zIndexCounter = 1000;

// 预加载图片
const preloadedImages = [];
allImages.forEach((img, index) => {
    const image = new Image();
    image.src = img.url;
    preloadedImages.push(image);
});

/**
 * 在鼠标位置生成一个图片
 */
function spawnImageAtPosition(x, y) {
    const now = Date.now();

    // 计算鼠标相对于上次生成位置的偏移
    const dx = Math.abs(x - lastSpawnX);
    const dy = Math.abs(y - lastSpawnY);

    // 检测鼠标是否移出了上一张图片的矩形边界
    // 图片以中心点定位，所以边界是宽度/2和高度/2
    const halfWidth = lastImageWidth / 2;
    const halfHeight = lastImageHeight / 2;
    const isOutsideImage = dx > halfWidth || dy > halfHeight;

    // 只有移出图片边界，并且超过时间间隔才生成新图片
    if (!isOutsideImage || now - lastSpawnTime < SPAWN_INTERVAL) return;

    lastSpawnTime = now;
    lastSpawnX = x;
    lastSpawnY = y;

    // 获取当前图片
    const imageData = allImages[currentImageIndex];
    currentImageIndex = (currentImageIndex + 1) % allImages.length;

    // 创建图片容器
    const item = document.createElement('div');
    item.className = 'trail-item';

    // 随机旋转角度 (-15 到 15 度)
    const rotation = (Math.random() - 0.5) * 30;

    // 随机大小 (300px 到 500px)
    const size = 300 + Math.random() * 200;

    // 记录这张图片的宽度，用于下次距离判断
    lastImageWidth = size;
    // 先假设高度等于宽度，图片加载后会更新实际高度
    lastImageHeight = size;

    // 设置位置（以鼠标为中心）
    // 递增 z-index 确保新图片永远在最上层
    zIndexCounter++;
    item.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        transform: translate(-50%, -50%) rotate(${rotation}deg) scale(0);
        z-index: ${zIndexCounter};
    `;
    console.log(`New image z-index: ${zIndexCounter}`);

    // 创建图片元素
    const img = document.createElement('img');
    img.src = imageData.url;
    img.alt = imageData.title;
    img.draggable = false;

    // 图片加载完成后，更新实际高度（用于下一张图片的边界检测）
    img.onload = function () {
        // 根据设置的宽度和图片原始比例计算实际渲染高度
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        lastImageHeight = size * aspectRatio;
    };

    // 创建标题
    const caption = document.createElement('div');
    caption.className = 'trail-caption';
    caption.textContent = imageData.title;

    // 创建胶带效果
    const tape = document.createElement('div');
    tape.className = 'trail-tape';

    item.appendChild(img);
    item.appendChild(caption);
    item.appendChild(tape);
    container.prepend(item);

    // 触发入场动画
    requestAnimationFrame(() => {
        item.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
        item.classList.add('is-visible');
    });

    // 限制最大图片数量，移除最早的图片（由于使用 prepend，最旧的图片在最后）
    // 使用 :not(.removing) 排除正在删除动画中的图片
    const items = container.querySelectorAll('.trail-item:not(.removing)');
    if (items.length > MAX_IMAGES) {
        const oldItem = items[items.length - 1];
        oldItem.classList.add('removing'); // 标记为正在删除
        oldItem.style.opacity = '0';
        oldItem.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0.5)`;
        setTimeout(() => oldItem.remove(), 300);
    }
}

// 鼠标移动事件监听
document.addEventListener('mousemove', e => {
    spawnImageAtPosition(e.clientX, e.clientY);
});

// 触摸事件支持（移动端）
document.addEventListener(
    'touchmove',
    e => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            spawnImageAtPosition(touch.clientX, touch.clientY);
        }
    },
    { passive: true }
);

// 点击也可以生成图片
document.addEventListener('click', e => {
    // 强制生成：重置时间和位置
    lastSpawnTime = 0;
    lastSpawnX = -9999;
    lastSpawnY = -9999;
    spawnImageAtPosition(e.clientX, e.clientY);
});

console.log(
    `🎨 Gallery loaded with ${allImages.length} images. Move your mouse to explore!`
);
