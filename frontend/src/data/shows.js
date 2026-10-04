import { theatres } from './theatres.js';

export const getShowsForMovie = (movieId) => {
  const shows = [];
  const times = ['10:30 AM', '1:45 PM', '4:30 PM', '7:15 PM', '10:00 PM'];
  const screenTypes = ['Standard', 'IMAX', 'Dolby Atmos'];
  
  // Base date is today
  const today = new Date();
  
  let showIdCounter = 1;
  
  theatres.forEach(theatre => {
    // Each theatre shows it for next 5 days
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + dayOffset);
      const dateString = showDate.toISOString().split('T')[0];
      
      // Select 3-5 random times
      const numShows = 3 + (showIdCounter % 3); // Gives 3, 4, or 5
      const selectedTimes = [];
      for (let i = 0; i < numShows; i++) {
         selectedTimes.push(times[i]);
      }
      
      selectedTimes.forEach((time, index) => {
        // Determine price based on time
        let price = 10;
        if (time === '7:15 PM' || time === '10:00 PM') {
          price = 15;
        } else if (time === '4:30 PM' || time === '1:45 PM') {
          price = 12;
        }
        
        const screenType = screenTypes[index % screenTypes.length];
        if (screenType === 'IMAX') price += 5;
        if (screenType === 'Dolby Atmos') price += 3;
        
        shows.push({
          id: `show-${movieId}-${theatre.id}-${dayOffset}-${index}`,
          movieId,
          theatreId: theatre.id,
          date: dateString,
          time: time,
          price: price,
          screenType: screenType
        });
        showIdCounter++;
      });
    }
  });
  
  return shows;
};
