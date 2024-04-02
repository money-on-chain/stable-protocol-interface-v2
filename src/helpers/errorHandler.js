import settings from '../settings/settings.json';

export const GetErrorMessage = (error) => {
  switch (error) {
    case 'qAC below minimum required':
      return 'RIF price went up, amount below minimum required';
    case 'Insufficient qac sent':
      return 'RIF price went down, insufficient RIF sent';
    case 'Low coverage':
      return 'System below protected global coverage';
    case 'Invalid Flux Capacitor Operation':
      return 'Error in flux capacitor';
    case null || undefined || '' || ' ' || 0 || 'null':
      return 'No message';
    default:
      return error;
  }
}