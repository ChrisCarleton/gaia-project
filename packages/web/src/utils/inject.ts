import { InjectionKey, inject as injectInternal } from 'vue';

export function inject<T>(key: InjectionKey<T>): T {
  const obj = injectInternal(key);
  if (!obj) {
    throw new Error(
      `Dependency injection failed for key "${key.description}". The application may be misconfigured.`,
    );
  }

  return obj;
}
