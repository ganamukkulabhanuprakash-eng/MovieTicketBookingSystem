// Simple hash function for consistent status based on showId and seatId
const getStatusHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const generateSeatLayout = (showId) => {
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const rows = [];
  
  rowLabels.forEach((label, rowIndex) => {
    let category = 'Standard';
    // First 2 rows (A, B) -> Premium
    // Last 2 rows (I, J) -> Economy
    // Rest -> Standard
    if (rowIndex < 2) {
      category = 'Premium';
    } else if (rowIndex >= rowLabels.length - 2) {
      category = 'Economy';
    }
    
    const seats = [];
    for (let num = 1; num <= 12; num++) {
      const seatId = `${label}${num}`;
      
      // Determine status using hash
      const hash = getStatusHash(`${showId}-${seatId}`);
      // roughly 30% booked
      const isBooked = (hash % 100) < 30;
      
      seats.push({
        id: seatId,
        number: num,
        status: isBooked ? 'booked' : 'available'
      });
    }
    
    rows.push({
      label,
      category,
      seats
    });
  });
  
  return { rows };
};
