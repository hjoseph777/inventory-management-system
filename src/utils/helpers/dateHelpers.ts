/**
 * Format a date string or timestamp to a human-readable format
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Check if an item's stock is low based on minimum stock level
 */
export const isLowStock = (quantity: number, minimumStock: number): boolean => {
  return quantity <= minimumStock;
};

/**
 * Calculate days since last restock
 */
export const daysSinceRestock = (lastRestockedDate: string): number => {
  const lastRestock = new Date(lastRestockedDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastRestock.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
