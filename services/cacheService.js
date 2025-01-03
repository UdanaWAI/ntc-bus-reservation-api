const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 3600, // Default TTL (1 hour) for cache items
  checkperiod: 600, // Check every 10 minutes for expired keys
});

exports.getCache = (key) => {
  return cache.get(key);
};

exports.setCache = (key, value) => {
  cache.set(key, value);
};

exports.delCache = (key) => {
  cache.del(key);
};
