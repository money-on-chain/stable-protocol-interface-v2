export const GetErrorMessage = (error) => {
  console.log('error to be shown in errorhandler ....' , error);
  console.log(error === 'null');
  console.log(error === null);
  switch (error) {
    case 'qAC below minimum required':
      return 'Redeem TP or TC RIF price up';
    case 'InsufficientQacSent':
      return 'Mint TP or TC price goes down';
    case 'Low coverage':
      return 'Below protected ctargema';
    case 'InvalidFluxCapacitorOperation':
      return 'Error in flux capacitor';
    case null || undefined || '' || ' ' || 0 || 'null':
      return 'No message';
    default:
      return error;
  }
}