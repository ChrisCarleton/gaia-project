import { Ref, onBeforeUnmount, onMounted } from 'vue';

export function useDetectOutsideClick(
  component: Ref<HTMLElement | undefined>,
  cb: () => void,
) {
  const listener = (event: MouseEvent) => {
    if (!component.value) return;

    if (
      event.target !== component.value &&
      event.composedPath().includes(component.value)
    ) {
      return;
    }

    cb();
  };

  onMounted(() => {
    window.addEventListener('click', listener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', listener);
  });

  return { listener };
}
