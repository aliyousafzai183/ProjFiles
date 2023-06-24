import { db } from './config';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { ToastAndroid } from 'react-native';
import { addNotification } from './notifications';

export const submitRating = async (bidderId, jobTitle, ratings) => {
    const title = " You are rated " + ratings + " out of 5 in " + jobTitle + " job!";
   

    try {

        await addDoc(collection(db, 'ratings'), {
            bidderId,
            ratings
        });
        await addNotification(bidderId, "Ratings", title, "success");
        ToastAndroid.show('Rating Submitted!', ToastAndroid.SHORT);
    } catch (error) {
        console.log(error);
        ToastAndroid.show('Error submitting bid!', ToastAndroid.SHORT);
    }
};

export const getRatings = (callback) => {
    const ratingsRef = collection(db, 'ratings');
  
    onSnapshot(ratingsRef, (snapshot) => {
      const ratings = [];
      snapshot.forEach((doc) => {
        const rating = {
          bidId: doc.id,
          ...doc.data(),
        };
  
        // Check if the jobPosterId of the bid is equal to the userId
        // if (ratings.bidderId === userId) {
        ratings.push(rating);
        // }
      });
      callback(ratings);
    });
  };
  