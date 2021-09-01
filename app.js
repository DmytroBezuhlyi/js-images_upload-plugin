import {initializeApp} from "firebase/app";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {upload} from "./upload";

const firebaseConfig = {
    apiKey: "AIzaSyC_Ue0m8zd3n-Hb7i9qq5E3nUSgQVy-yw4",
    authDomain: "upload-app-c89c1.firebaseapp.com",
    projectId: "upload-app-c89c1",
    storageBucket: "upload-app-c89c1.appspot.com",
    messagingSenderId: "637181390325",
    appId: "1:637181390325:web:199fbea15de513341dc4bc"
};

initializeApp(firebaseConfig);

const storage = getStorage();

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', 'jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const storageRef = ref(storage, `images/${file.name}`);
            const task = uploadBytesResumable(storageRef, file);

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
                const block = blocks[index].querySelector('.preview-info-progress');
                block.textContent = percentage;
                block.style.width = percentage;
            }, error => {
                console.log(error);
            }, () => {
                getDownloadURL(task.snapshot.ref).then((downloadURL) => {
                    console.log(`File '${file.name}' available at `, downloadURL);
                });
            })
        })
    }
});