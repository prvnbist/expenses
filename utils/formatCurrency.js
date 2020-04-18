export const formatCurrency = amount =>
   new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
   }).format(amount)
