/**************************************************************************
 *  (C) Copyright ModusBox Inc. 2019 - All rights reserved.               *
 *                                                                        *
 *  This file is made available under the terms of the license agreement  *
 *  specified in the corresponding source code repository.                *
 *                                                                        *
 *  ORIGINAL AUTHOR:                                                      *
 *       James Bush - james.bush@modusbox.com                             *
 **************************************************************************/

'use strict';


const fs = require('fs');

// A promise wrapper around fs.readFile
// Redundant on node 10 and above, use require('fs').promises instead
async function readFile(...args) {
    const p = new Promise((resolve, reject) => {
        fs.readFile(...args, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
    return p;
}


// TODO: implement toString, toJSON toAnythingElse methods on config so that secrets can't be
// printed
let config = {
    schemeName: 'default',
    peerEndpoint: '172.17.0.2:3001',
    backendEndpoint: '172.17.0.2:3001',
    dfspId: 'mojaloop-sdk',
    ilpSecret: 'mojaloop-sdk',
    checkIlp: true,
    expirySeconds: 60,
    autoAcceptQuotes: true,
    tls: {
        mutualTLS: { enabled: false },
        inboundCreds: {
            ca: null,
            cert: null,
            key: null
        },
        outboundCreds: {
            ca: null,
            cert: null,
            key: null
        }
    },
    validateInboundJws: true,
    jwsSign: true,
    jwsSigningKey: null,
    jwsVerificationKeyStore: null,
    cacheConfig: {
        host: 'localhost',
        port: 6379
    }
};


const setConfig = async cfg => {
    config.tls.mutualTLS.enabled = cfg.MUTUAL_TLS_ENABLED.toLowerCase() === 'false' ? false : true;
    config.schemeName = cfg.SCHEME_NAME;

    config.peerEndpoint = cfg.PEER_ENDPOINT;
    config.backendEndpoint = cfg.BACKEND_ENDPOINT;

    config.dfspId = cfg.DFSP_ID;
    config.ilpSecret = cfg.ILP_SECRET;
    config.checkIlp = cfg.CHECK_ILP.toLowerCase() === 'false' ? false : true;
    config.expirySeconds = Number(cfg.EXPIRY_SECONDS);
    config.autoAcceptQuotes = cfg.AUTO_ACCEPT_QUOTES.toLowerCase() === 'true' ? true : false;

    // Getting secrets from files instead of environment variables reduces the likelihood of
    // accidental leakage.
    if (config.tls.mutualTLS.enabled) {
        // read inbound certs/keys
        [config.tls.inboundCreds.ca, config.tls.inboundCreds.cert, config.tls.inboundCreds.key] = await Promise.all([
            readFile(cfg.IN_CA_CERT_PATH),
            readFile(cfg.IN_SERVER_CERT_PATH),
            readFile(cfg.IN_SERVER_KEY_PATH)
        ]);

        //read outbound certs/keys
        [config.tls.outboundCreds.ca, config.tls.outboundCreds.cert, config.tls.outboundCreds.key] = await Promise.all([
            readFile(cfg.OUT_CA_CERT_PATH),
            readFile(cfg.OUT_SERVER_CERT_PATH),
            readFile(cfg.OUT_SERVER_KEY_PATH)
        ]);
    }

    config.validateInboundJws = cfg.VALIDATE_INBOUND_JWS.toLowerCase() === 'false' ? false : true;
    config.jwsSign = cfg.JWS_SIGN.toLowerCase() === 'false' ? false : true;
    config.jwsSigningKey = await readFile(cfg.JWS_SIGNING_KEY_PATH);
    config.jwsVerificationKeyStore = cfg.JWS_VERIFICATION_KEY_STORE;

    config.cacheConfig.host = cfg.CACHE_HOST;
    config.cacheConfig.port = cfg.CACHE_PORT;
};


const getConfig = () => {
    return config;
};


module.exports = {
    getConfig,
    setConfig
};