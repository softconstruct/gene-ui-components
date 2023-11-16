module.exports =
    process.env.REACT_APP_CORE_PLATFORM === 'mobile' ? require('./src/index.mobile') : require('./src/index');
