import firebase from 'firebase/app';
import 'firebase/firestore';
import { addDoc, collection, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const sendMessage = async (jobPosterId, bidderId, message, role) => {
  try {
    const newMessageRef = await addDoc(collection(db, 'messages'), {
      jobPosterId,
      bidderId,
      message,
      role,
      timestamp: serverTimestamp() // Use server timestamp instead of currentDate
    });
    console.log('Message sent successfully');
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
