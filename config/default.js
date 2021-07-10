"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: 3000,
    host: "localhost",
    // dbUri: "mongodb://localhost:27017/rest-api",
    dbUri: "mongodb://mongodb/rest-api",
    saltWorkFactor: 10,
    accessTokenTtl: "30m",
    refreshTokenTtl: "1y",
    privateKey: '#*##KEY##*#'
};
