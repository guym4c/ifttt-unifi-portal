# ifttt-unifi-portal 

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/guym4c/ifttt-unifi-portal)

Verify Unifi users using IFTTT notifications, using Netlify and Redis.

## Installation
You will need:
1. A blank Redis instance.
2. A Unifi controller accessible over the internet.
3. An IFTTT account.

Set the provided environment variables, link up a domain and you're good to go.

## Linking to IFTTT
On the IFTTT side, you'll need to set up an applet to approve connecting users.

Set the relevant env variable to what you're named your maker event trigger. You now need a way of authorising guests - probably an IFTTT app notification. You're provided with the guest's name (as they gave it) as the ingredient `value1`, and the approval link as `value2`.

## Adding to Unifi
In the *general hotspot* settings on your network controller, set the *authentication mode* to *external portal server* and insert Netlify's external load balancer IP of 104.198.14.52.

Then, in the *advanced* screen, enable *redirect using hostname*, and set the host to the domain that points to this application's Netlify deployment.

## Redis
The storage the app requires on Redis is minimal - the 30MB that [RedisLabs give you free](https://redislabs.com/redis-enterprise-cloud/pricing/) is easily sufficient.

The app doesn't clear keys from Redis - set the eviction policy to `allkeys-lru` to allow the keys to rotate.
