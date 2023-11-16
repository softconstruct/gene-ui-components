import ReactDOM from 'react-dom';

const callAfterDelay = (callBack, time) => {
    const timerId = setTimeout(() => {
        clearTimeout(timerId);
        ReactDOM.unstable_batchedUpdates(() => {
            callBack();
        });
    }, time);
};

export default callAfterDelay;
