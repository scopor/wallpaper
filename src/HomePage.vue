<template>
  <div class="home" @touchstart="touchStart" @touchend="touchEnd">
    <h1>Wallpaper</h1>
    <div class="wallpaper-container" @click="handleClick">
      <img :src="currentWallpaper?.urls.small" :alt="currentWallpaper?.alt_description" />
      <p>{{ currentWallpaper?.alt_description || '无描述' }}</p>
    </div>

    <!-- 全屏模态框 -->
    <div v-if="isFullscreen" class="fullscreen-modal" @click="closeFullscreen">
      <img :src="'' || currentWallpaper?.urls.full" :alt="currentWallpaper?.alt_description" class="fullscreen-image" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { fetchWallpapers } from './api/UnsplashApi';

interface Wallpaper {
  urls: {
    small: string;
    full: string;
  };
  alt_description: string;
  description?: string;
}
export default defineComponent({
  setup() {
    const wallpapers = ref<Wallpaper[]>([]);
    const previousWallpapers = ref<Wallpaper[]>([]);
    const currentIndex = ref(0);
    const currentWallpaper = ref<Wallpaper | null>(null);
    const isFullscreen = ref(false);

    const loadWallpapers = async () => {
      try {
        previousWallpapers.value = [...wallpapers.value];
        wallpapers.value = await fetchWallpapers();
        currentIndex.value = 0;
        currentWallpaper.value = wallpapers.value[currentIndex.value];
      } catch (error) {
        console.error('Failed to load wallpapers:', error);
      }
    };

    const nextWallpaper = () => {
      if (currentIndex.value < wallpapers.value.length - 1) {
        currentIndex.value++;
      } else {
        loadWallpapers();
        return;
      }
      updateCurrentWallpaper();
    };

    const prevWallpaper = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      } else if (previousWallpapers.value.length > 0) {
        wallpapers.value = previousWallpapers.value;
        currentIndex.value = previousWallpapers.value.length - 1;
        previousWallpapers.value = [];
      } else {
        console.log('已经是第一张壁纸');
        return;
      }
      updateCurrentWallpaper();
    };

    const updateCurrentWallpaper = () => {
      currentWallpaper.value = wallpapers.value[currentIndex.value];
    };

    const handleClick = (event: MouseEvent) => {
      const imgElement = event.currentTarget as HTMLElement;
      const img = imgElement.querySelector('img') as HTMLImageElement;

      if (!img) return;

      const imgWidth = img.clientWidth;
      const clickX = event.clientX - imgElement.getBoundingClientRect().left;

      if (clickX < imgWidth / 2) {
        prevWallpaper();
      } else if (clickX > imgWidth / 2) {
        nextWallpaper();
      } else {
        openFullscreen();
      }
    };

    const openFullscreen = () => {
      isFullscreen.value = true;
    };

    const closeFullscreen = () => {
      isFullscreen.value = false;
    };

    // 手势滑动
    let startX = 0;

    const touchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
    };

    const touchEnd = (event: TouchEvent) => {
      const endX = event.changedTouches[0].clientX;
      if (startX > endX + 50) {
        nextWallpaper();
      } else if (startX < endX - 50) {
        prevWallpaper();
      }
    };

    onMounted(() => {
      loadWallpapers();
    });

    return { currentWallpaper, touchStart, touchEnd, handleClick, openFullscreen, closeFullscreen, isFullscreen };
  },
});
</script>

<style scoped>
.home {
  text-align: center;
}
.wallpaper-container {
  margin: 20px;
}
.wallpaper-container img {
  width: 100%;
  height: auto;
  max-width: 600px; /* 限制最大宽度 */
}
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保模态框在最上层 */
}
.fullscreen-image {
  max-width: 100%;
  max-height: 100%;
}
</style>
