export const fetchReportPriceAndCoupon = async () => {
  try {
    const response = await fetch('/api/getReportPriceAndCoupon', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch prices');
    }

    const priceAndCoupon = await response.json();
    return priceAndCoupon;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
};

