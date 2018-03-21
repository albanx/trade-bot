import ProviderModel from '../models/ProviderModel';

const createProvider = ({name, apiUrl, websiteUrl}) => new ProviderModel(name, apiUrl, websiteUrl);

export default createProvider;
