import { db } from './config';
import { doc, setDoc, addDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { ToastAndroid } from 'react-native';

export const postJob = async (jobId, title, salary, email, jobPosterId, duration, description, category, time) => {
    try {
        if (jobId) {
            await setDoc(doc(db, 'jobs', jobId), {
                title,
                salary,
                email,
                jobPosterId,
                duration,
                description,
                category,
                time
            });
            console.log('Job Updated');
        } else {
            await addDoc(collection(db, 'jobs'), {
                title,
                salary,
                email,
                jobPosterId,
                duration,
                description,
                category,
                time
            });
            console.log('Job Posted');
        }
    } catch (error) {
        console.log(error);
    }
};

export const getJobs = (callback) => {
    const jobsRef = collection(db, 'jobs');

    onSnapshot(jobsRef, (snapshot) => {
        const jobs = [];
        snapshot.forEach((doc) => {
            jobs.push({
                jobId: doc.id,
                ...doc.data()
            });
        });
        callback(jobs);
    });
};

export const getJobsByBuyerId = (jobPosterId, callback) => {
    const jobsRef = collection(db, 'jobs');

    onSnapshot(jobsRef, (snapshot) => {
        const jobs = [];
        snapshot.forEach((doc) => {
            const job = {
                jobId: doc.id,
                ...doc.data()
            };

            if(job.jobPosterId === jobPosterId){
                jobs.push(job);
            }
        });
        callback(jobs);
    });
};

export const getJobById = (jobId, callback) => {
    const jobRef = doc(db, 'jobs', jobId);

    onSnapshot(jobRef, (docSnap) => {
        if (docSnap.exists()) {
            const jobData = {
                jobId: docSnap.id,
                ...docSnap.data()
            };
            callback(jobData);
        } else {
            console.log('Job document not found');
            callback([]);
        }
    });
};

export const deleteJob = async (jobId) => {
    try {
        const jobRef = doc(db, 'jobs', jobId);
        await deleteDoc(jobRef);
        ToastAndroid.show('Job Deleted!', ToastAndroid.SHORT);
    } catch (error) {
        ToastAndroid.show(error.code+ ' Error Deleting Job!', ToastAndroid.SHORT);
    }
};
