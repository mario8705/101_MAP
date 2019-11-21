module.exports = {
    apiEndpoint: "https://api.intra.42.fr/",
    serverPort: 8080,
    clientPath: "/../public/",
    connectedUsers_loopRate: 30, // seconds
    requestsBySecond: 2, // In queue
    connectedUsers_cacheExpiration: 10, // minutes
    redirect_uri: "http://z3r10p1.le-101.fr:3000/",
    streamLogToConsole: true,
    blocId: 8
};
