import { db } from './config';
import { doc, setDoc, updateDoc, addDoc, collection, onSnapshot, deleteDoc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { ToastAndroid } from 'react-native';
import { addNotification } from './notifications';
import { deleteJob } from './jobs';

export const postBid = async (bidId, jobId, jobPosterId, name, coverLetter, email, bidAmount, bidderId, jobTitle, isNew) => {
    const title = name + " posted a bid on your job " + jobTitle;

    try {
        if (bidId && bidId !== null) {
            await setDoc(doc(db, 'bids', bidId), {
                jobId,
                jobPosterId,
                name,
                coverLetter,
                email,
                bidAmount,
                bidderId,
                jobTitle,
                status: 'uninvited',
                isNew
            });
            ToastAndroid.show('Bid Updated!', ToastAndroid.SHORT);
        } else {
            const newBidRef = await addDoc(collection(db, 'bids'), {
                jobId,
                jobPosterId,
                name,
                coverLetter,
                email,
                bidAmount,
                bidderId,
                jobTitle,
                status: 'uninvited'
            });
            const newBidId = newBidRef.id;
            try {
                await addNotification(jobPosterId, title, coverLetter, "info");
                ToastAndroid.show('Bid Submitted!', ToastAndroid.SHORT);
            } catch (error) {
                console.log('Error adding notification:', error);
                ToastAndroid.show('Error submitting bid!', ToastAndroid.SHORT);
            }
        }
    } catch (error) {
        console.log(error);
        ToastAndroid.show('Error submitting bid!', ToastAndroid.SHORT);
    }
};

export const getBidsForBuyer = (userId, status, callback) => {
    const bidsRef = collection(db, 'bids');

    onSnapshot(bidsRef, (snapshot) => {
        const bids = [];
        snapshot.forEach((doc) => {
            const bid = {
                bidId: doc.id,
                ...doc.data()
            };

            // Check if the jobPosterId of the bid is equal to the userId
            if (bid.jobPosterId === userId && bid.status === status) {
                bids.push(bid);
            }
        });
        callback(bids);
    });
};

export const getAllBidsForBuyer = (userId, callback) => {
    const bidsRef = collection(db, 'bids');

    onSnapshot(bidsRef, (snapshot) => {
        const bids = [];
        snapshot.forEach((doc) => {
            const bid = {
                bidId: doc.id,
                ...doc.data()
            };

            // Check if the jobPosterId of the bid is equal to the userId
            if (bid.jobPosterId === userId) {
                bids.push(bid);
            }
        });
        callback(bids);
    });
};

export const getNoOfBidsForSeller = (userId, status, callback) => {
    const bidsRef = collection(db, 'bids');
  
    onSnapshot(bidsRef, (snapshot) => {
      let count = 0;
      let earnings = 0;
  
      snapshot.forEach((doc) => {
        const bid = doc.data();
  
        if (bid.bidderId === userId && bid.status === status) {
          count++;
          earnings += parseInt(bid.bidAmount, 10); // Parse the bid value to an integer
        }
      });
  
      callback(count, earnings);
    });
  };
  

export const getBidsForSeller = (userId, status, callback) => {
    const bidsRef = collection(db, 'bids');

    onSnapshot(bidsRef, (snapshot) => {
        const bids = [];
        snapshot.forEach((doc) => {
            const bid = {
                bidId: doc.id,
                ...doc.data()
            };

            // Check if the jobPosterId of the bid is equal to the userId
            if (bid.bidderId === userId && bid.status === status) {
                bids.push(bid);
            }
        });
        callback(bids);
    });
};

export const getAllBidsForSeller = (userId, callback) => {
    const bidsRef = collection(db, 'bids');

    onSnapshot(bidsRef, (snapshot) => {
        const bids = [];
        snapshot.forEach((doc) => {
            const bid = {
                bidId: doc.id,
                ...doc.data()
            };

            // Check if the jobPosterId of the bid is equal to the userId
            if (bid.bidderId === userId) {
                bids.push(bid);
            }
        });
        callback(bids);
    });
};

export const updateBidStatus = async (bidId, bidderId, jobTitle, status, jobId) => {
    try {
        const bidDocRef = doc(db, 'bids', bidId);
        await updateDoc(bidDocRef, { status });
        if (status === 'invited') {
            await addNotification(bidderId, jobTitle, 'You received an invite!', 'success');
            ToastAndroid.show('Invite Sent!', ToastAndroid.SHORT);
        } else if (status === 'accepted') {
            await addNotification(bidderId, jobTitle, 'Order Started! Check in ongoing orders', 'success');
            await deleteJob(jobId);
            ToastAndroid.show('Order Started!', ToastAndroid.SHORT);
        } else if (status === 'completed') {
            await addNotification(bidderId, jobTitle, 'Order completed! Check completed orders in jobs detail', 'success');
            ToastAndroid.show('Order Completed!', ToastAndroid.SHORT);
        }
    } catch (error) {
        console.log(error);
        ToastAndroid.show('Error sending invite!', ToastAndroid.SHORT);
    }
};

export const DeliverBid = async (bidId, jobPosterId, jobTitle, delivery, status) => {
    try {
        const bidDocRef = doc(db, 'bids', bidId);
        await updateDoc(bidDocRef, { status, delivery: delivery });
        await addNotification(jobPosterId, jobTitle, 'Order Delivered! Check order delivery from active orders', 'success');
        ToastAndroid.show('Order Delivered!', ToastAndroid.SHORT);
    } catch (error) {
        console.log(error);
        ToastAndroid.show('Error delivering order!', ToastAndroid.SHORT);
    }
};


// for seller to see applied for
export const getTotalBids = (userId, callback) => {
    const bidsRef = collection(db, 'bids');

    onSnapshot(bidsRef, (snapshot) => {
        const bids = [];
        snapshot.forEach((doc) => {
            const bid = {
                bidId: doc.id,
                ...doc.data()
            };

            // Check if the jobPosterId of the bid is equal to the userId
            if (bid.bidderId === userId) {
                bids.push(bid);
            }
        });
        callback(bids);
    });
};

export const getBidByBidId = async (bidId, callback) => {
    try {
        const bidDocRef = doc(db, 'bids', bidId);
        const bidDocSnapshot = await getDoc(bidDocRef);
        if (bidDocSnapshot.exists()) {
            const bidData = bidDocSnapshot.data();
            callback(bidData);
        } else {
            callback('Bid not found', null);
        }
    } catch (error) {
        callback('Error retrieving bid', null);
    }
};


export const deleteBid = (bidId, bidderId, jobTitle) => {
    const title = "Job: " + jobTitle;
    const description = "We are sorry to let you know that your proposal was rejected. Good luck next time";

    const bidRef = doc(db, 'bids', bidId);

    deleteDoc(bidRef)
        .then(() => {
            // Add notification when bid is deleted
            try {
                addNotification(bidderId, title, description, "error");
            } catch (error) {
                console.log('Error adding notification:', error);
            }

            ToastAndroid.show('Bid Deleted Successfully!', ToastAndroid.SHORT);
        })
        .catch((error) => {
            ToastAndroid.show('Error Deleting Bid!', ToastAndroid.SHORT);
        });
};

export const deleteInvitedBid = (bidId) => {
    const bidRef = doc(db, 'bids', bidId);

    deleteDoc(bidRef)
        .then(() => {
            console.log('Deleted Invited Bid!');
        })
        .catch((error) => {
            ToastAndroid.show('Error Deleting Bid!', ToastAndroid.SHORT);
        });
};



export const checkBidExists = (jobId, bidderId, callback) => {
    const bidsRef = collection(db, 'bids');
    const queryRef = query(bidsRef, where('jobId', '==', jobId), where('bidderId', '==', bidderId));

    onSnapshot(queryRef, (snapshot) => {
        if (!snapshot.empty) {
            const bidId = snapshot.docs[0].id;
            callback(bidId);
        } else {
            callback(null);
        }
    });
};

export const getBidCountByJobId = async (jobId) => {
    const bidsRef = collection(db, 'bids');
    const queryRef = query(bidsRef, where('jobId', '==', jobId));

    const snapshot = await getDocs(queryRef);
    const numberOfBids = snapshot.size;

    return numberOfBids;
};

export const getBidByJobIdAndBidderId = async (jobId, bidderId, callback) => {
    const bidsRef = collection(db, 'bids');
    const q = query(bidsRef, where('jobId', '==', jobId), where('bidderId', '==', bidderId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const bid = querySnapshot.docs[0].data();
        const bidData = {
            bidId: querySnapshot.docs[0].id,
            ...bid,
        };
        callback(bidData);
    } else {
        callback('Bid not found', null);
    }
};
