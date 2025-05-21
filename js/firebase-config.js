// Firebase configuration
const firebaseConfig = {
  apiKey: "test-api-key",
  authDomain: "memes-gallery.firebaseapp.com",
  databaseURL: "https://memes-gallery-default-rtdb.firebaseio.com",
  projectId: "memes-gallery",
  storageBucket: "memes-gallery.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase with error handling
try {
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Fallback to localStorage if Firebase fails
  const database = {
    ref: (path) => ({
      set: async (value) => {
        localStorage.setItem(path, JSON.stringify(value));
        return Promise.resolve();
      },
      on: (event, callback) => {
        const value = JSON.parse(localStorage.getItem(path) || "null");
        callback({ val: () => value });
      },
      once: (event) => {
        return Promise.resolve({
          val: () => {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key.startsWith('memes/')) {
                data[key.split('/')[1]] = {
                  rating: JSON.parse(localStorage.getItem(key))
                };
              }
            }
            return data;
          }
        });
      }
    })
  };
}

// Centralized rating functions with error handling
const RatingService = {
  async updateRating(memeId, newRating) {
    try {
      if (newRating < 0) return false; // Prevent negative ratings
      await database.ref(`memes/${memeId}/rating`).set(newRating);
      console.log(`Rating updated for meme ${memeId}: ${newRating}`);
      return true;
    } catch (error) {
      console.error('Error updating rating:', error);
      // Fallback to localStorage
      localStorage.setItem(`memes/${memeId}/rating`, newRating);
      return true;
    }
  },

  onRatingChange(memeId, callback) {
    try {
      database.ref(`memes/${memeId}/rating`).on('value', (snapshot) => {
        const newRating = snapshot.val();
        if (newRating !== null) {
          console.log(`Rating changed for meme ${memeId}: ${newRating}`);
          callback(newRating);
        }
      });
    } catch (error) {
      console.error('Error subscribing to rating changes:', error);
      // Fallback to localStorage
      const savedRating = localStorage.getItem(`memes/${memeId}/rating`);
      if (savedRating !== null) {
        callback(parseInt(savedRating));
      }
    }
  },

  async initializeMemeRatings(memes) {
    try {
      const snapshot = await database.ref('memes').once('value');
      const storedRatings = snapshot.val() || {};
      
      // Initialize ratings in database if they don't exist
      for (const meme of memes) {
        if (!storedRatings[meme.id]) {
          await this.updateRating(meme.id, meme.rating);
        } else {
          meme.rating = storedRatings[meme.id].rating;
        }
      }
      console.log('Meme ratings initialized successfully');
    } catch (error) {
      console.error('Error initializing meme ratings:', error);
      // Fallback to localStorage
      memes.forEach(meme => {
        const savedRating = localStorage.getItem(`memes/${meme.id}/rating`);
        if (savedRating !== null) {
          meme.rating = parseInt(savedRating);
        }
      });
    }
  }
}; 