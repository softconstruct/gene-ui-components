class Logger {
    success(message) {
        console.log(`%c${message}`, 'color: green');
    }

    warning(message) {
        console.warn(message);
    }

    error(message) {
        console.error(message);
    }

    deprecate(message) {
        console.warn(`DEPRECATION WARNING(gene-ui): ${message}`);
    }
}

export default new Logger();
