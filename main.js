import images from './images.js';

const galleryContainer = document.getElementById('gallery-grid');

/**
 * 渲染图片：支持 url 为数组格式
 */
function renderGallery() {
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '';

    let imageIndex = 0;

    images.forEach(group => {
        // url 可以是数组或单个字符串
        const urls = Array.isArray(group.url) ? group.url : [group.url];

        urls.forEach(url => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            // 交错动画延迟
            item.style.animationDelay = `${imageIndex * 0.05}s`;

            const imageElement = new Image();
            imageElement.src = url;
            imageElement.alt = group.title;
            imageElement.loading = 'lazy';

            // 图片加载完成后的处理
            imageElement.onload = () => {
                item.classList.add('is-loaded');
            };

            item.innerHTML = `
                <div class="item-caption">${group.title}</div>
            `;
            item.insertBefore(imageElement, item.firstChild);

            galleryContainer.appendChild(item);
            imageIndex++;
        });
    });
}

// 初始化渲染
renderGallery();
