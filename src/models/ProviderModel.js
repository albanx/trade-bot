export default class ProviderModel {
  constructor(name, apiUrl, websiteUrl) {
    this.name =name;
    this.apiUrl = apiUrl;
    this.websiteUrl = websiteUrl;
  }

  getName() {
    return this.name;
  }

  getApiUrl() {
    return this.apiUrl;
  }

  getWebsiteUrl() {
    return this.websiteUrl;
  }
}
