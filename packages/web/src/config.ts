class Config {
  private parseBoolean(value?: unknown): boolean {
    if (typeof value === 'string') {
      value = value.trim();
      return value === 'true' || value === '1';
    }

    return false;
  }

  get unlimitedResources(): boolean {
    return this.parseBoolean(process.env.VUE_APP_CHEATS_RESOURCES);
  }
}

export default new Config();
