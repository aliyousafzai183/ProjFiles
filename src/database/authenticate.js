import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { ToastAndroid } from 'react-native';
import { app, db } from './config';
import { doc, setDoc, getDoc, onSnapshot, collection, where, query } from 'firebase/firestore';

const auth = getAuth();

const Signup = async (email, password, callback) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
        AsyncStorage.setItem('userId', userId)
          .then(() => {
            // Send email verification
            sendEmailVerification(auth.currentUser)
              .then(() => {
                ToastAndroid.show('Signed up successfully! Verification email sent.', ToastAndroid.SHORT);
                callback(userId);
              })
              .catch((error) => {
                console.log(error);
                callback(null);
              });
          })
          .catch((error) => {
            console.log(error);
            callback(null);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        callback(null);
      });
  } catch (error) {
    const errorMessage = error.message;
    ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    callback(null);
  }
};

// function to handle email verification status
// function to handle email verification status
export const checkEmailVerificationStatus = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      const isEmailVerified = user.emailVerified;
      console.log(isEmailVerified);
      callback(isEmailVerified);
    } else {
      // User is signed out
      callback(false);
    }
  });
};


// Function to resend verification email
export const resendVerificationEmail = () => {
  const user = auth.currentUser;
  if (user) {
    sendEmailVerification(user)
      .then(() => {
        ToastAndroid.show('Verification email sent.', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log('No user is signed in.');
  }
};

const Signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    await AsyncStorage.setItem('userId', userId);

    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userRole = docSnap.data().role;
      await AsyncStorage.setItem('role', userRole);
      return userRole;
    } else {
      ToastAndroid.show('User document not found!', ToastAndroid.LONG);
      return null;
    }
  } catch (error) {
    const errorMessage = error.message;
    ToastAndroid.show(errorMessage.slice(16, 50), ToastAndroid.LONG);
    console.log(errorMessage);
    return null;
  }
};


export const createUser = async (id, firstName, lastName, contact, email, about, address, cnic, country, role, skills, cat, profileImage) => {
  try {
    await setDoc(doc(db, 'users', id), {
      firstName: firstName,
      lastName: lastName,
      contact: contact,
      email: email,
      about: about,
      address: address,
      cnic: cnic,
      country: country,
      role: role,
      skills: skills,
      category: cat,
      profileImage: profileImage
    });
    console.log('User Created');
  } catch (error) {
    console.log(error);
  }
};

export const getUserDataById = (userId, callback) => {
  const userCollectionRef = collection(db, 'users');

  const queryById = doc(userCollectionRef, userId);
  const queryByContact = query(userCollectionRef, where('contact', '==', userId));

  const unsubscribeById = onSnapshot(queryById, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      callback(userData);
    } else {
      console.log('User not found');
      callback(null);
    }
  }, (error) => {
    console.log(error);
    callback(null);
  });

  const unsubscribeByContact = onSnapshot(queryByContact, (querySnapshot) => {
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        callback(userData);
      });
    } else {
      console.log('User not found');
      callback(null);
    }
  }, (error) => {
    console.log(error);
    callback(null);
  });

  return [unsubscribeById, unsubscribeByContact];
};


export const getUserData = (contact, callback) => {
  const usersCollectionRef = collection(db, 'users');

  const queryByContact = query(usersCollectionRef, where('contact', '==', contact));
  const queryById = doc(db, 'users', contact);

  const unsubscribeContact = onSnapshot(queryByContact, (querySnapshot) => {
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      callback(userData);
    } else {
      // If contact field match not found, try matching with document ID
      unsubscribeContact(); // Unsubscribe from contact query
      const unsubscribeId = onSnapshot(queryById, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          callback(userData);
        } else {
          console.log('User document not found');
          callback(null);
        }
      }, (error) => {
        console.log(error);
        callback(null);
      });
      // Return the combined unsubscribe function
      return () => {
        unsubscribeContact();
        unsubscribeId();
      };
    }
  }, (error) => {
    console.log(error);
    callback(null);
  });

  // Return the unsubscribe function for the contact query
  return unsubscribeContact;
};



export const getUsersByCategory = (category, callback) => {
  const usersRef = collection(db, 'users');

  const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
    const filteredUsers = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();

      // Filter users based on matching skills, role as seller, and category
      const isSeller = userData.role === 'Seller';

      if (userData.category === category && isSeller) {
        filteredUsers.push(userData);

      }
    });

    callback(filteredUsers);
  }, (error) => {
    console.log(error);
    callback([]);
  });

  return unsubscribe; // Return the unsubscribe function to stop listening when needed
};

// Function to send a password reset email
export const ForgotPassword = async (email) => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      ToastAndroid.show('Password reset Email Sent!', ToastAndroid.SHORT);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);

    });
};




export { Signup, Signin };