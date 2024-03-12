export const GetErrorMessage = (error) => {
  switch (error) {
    case 'qAC below minimum required':
      return 'Redeem TP or TC RIF price up';
    case 'InsufficientQacSent':
      return 'Mint TP or TC price goes down';
    case 'Low coverage':
      return 'Below protected ctargema';
    case 'InvalidFluxCapacitorOperation':
      return 'Error in flux capacitor';
    default:
      return 'Error in operation';
  }
}