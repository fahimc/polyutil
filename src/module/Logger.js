var Logger = {
    warn: function(message) {
        this.log(message);
    },
    log: function(message) {
        this.log(message);
    },
    ok: function(message) {
        this.log(message);
    },
    log: function(message) {
        console.log(message);
    }
};
module.exports = Logger;