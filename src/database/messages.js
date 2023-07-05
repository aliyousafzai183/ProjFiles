import firebase from 'firebase/app';
import 'firebase/firestore';
import { addDoc, collection, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { addNotification } from './notifications';

export const sendMessage = async (jobPosterId, bidderId, message, role, name) => {
  try {
    const newMessageRef = await addDoc(collection(db, 'messages'), {
      jobPosterId,
      bidderId,
      message,
      role,
      timestamp: serverTimestamp() // Use server timestamp instead of currentDate
    });

    try {
      if (role === "Seller") {
        await addNotification(jobPosterId, "You received a message from " + name + " !", message, "message");
      } else {
        await addNotification(bidderId, "A new message from " + name + " job !", message, "message");
      }
    } catch (error) {
      console.log('Error adding notification:', error);
    }
  } catch (error) {
    console.log('Error sending message:', error);
  }
};

export const receiveMessage = (jobPosterId, bidderId, callback) => {
  const messageRef = collection(db, 'messages');
  const q = query(
    messageRef,
    where('jobPosterId', '==', jobPosterId),
    where('bidderId', '==', bidderId),
    orderBy('timestamp') // Order messages by timestamp
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messageList = [];
    snapshot.forEach((doc) => {
      const message = doc.data();
      messageList.push({
        id: doc.id,
        ...message,
      });
    });
    callback(messageList);
  });

  return unsubscribe;
};
