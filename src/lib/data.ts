export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// Helper to format INR
export function formatINR(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}
