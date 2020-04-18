export const formatDate = date =>
   new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
   }).format(new Date(date + '.000Z'))
