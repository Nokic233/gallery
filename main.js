import images from './images.js';

const galleryContainer = document.getElementById('gallery-grid');

/**
 * 极简渲染逻辑：直接展示 images.js 中的所有图片
 */
function renderGallery() {
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '';

    images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        // 交错动画延迟
        item.style.animationDelay = `${index * 0.05}s`;

        const imageElement = new Image();
        imageElement.src = img.url;
        imageElement.alt = img.title;
        imageElement.loading = 'lazy';

        // 图片加载完成后的处理
        imageElement.onload = () => {
            item.classList.add('is-loaded');
        };

        item.innerHTML = `
            <div class="item-caption">${img.title}</div>
        `;
        // 将图片对象插入到标题之前
        item.insertBefore(imageElement, item.firstChild);

        galleryContainer.appendChild(item);
    });
}

// 初始化渲染
renderGallery();
