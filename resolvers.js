import asyncRedis from "async-redis";
const client = asyncRedis.createClient();
import { fetch } from "cross-fetch";

export default {
  Query: {
    nrOfRepos: async (_parent, { username }, { client }) => {
      const value = await getIfCached(username);

      //If value is cached, return value
      if (value) return value;
      // If not, fetch the value and store in cache
      try {
        console.log("Fetching data...");
        const res = await fetch(`https://api.github.com/users/${username}`);
        const json = await res.json();
        storeInCache(username, json.public_repos);
        return json.public_repos;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  },
};

async function storeInCache(key, value) {
  try {
    await client.set(key, value, "EX", 10);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getIfCached(key) {
  try {
    const value = await client.get(key);
    if (value) return value;
  } catch (e) {
    return false;
  }
}
