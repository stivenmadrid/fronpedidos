import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  //  apiUrl: 'https://gts.sarysas.com.co:8087/index.php/api/psary'
  apiUrl: 'http://127.0.0.1:8000/api/psary'
};
