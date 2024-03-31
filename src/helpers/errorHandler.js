export const GetErrorMessage = (error) => {
  switch (error) {
    case 'qAC below minimum required':
      return 'Redeem TP or TC RIF price up';
    case 'Insufficient qac sent':
      return 'Mint TP or TC price goes down';
    case 'Low coverage':
      return 'Below protected ctargema';
    case 'Invalid Flux Capacitor Operation':
      return 'Error in flux capacitor';
    case null || undefined || '' || ' ' || 0 || 'null':
      return 'No message';
    default:
      return error;
  }
}