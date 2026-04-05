export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const formatMonthYear = (year, month) => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong.';
