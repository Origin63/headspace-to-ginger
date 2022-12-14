
## Hubspot CRM Notes

Typical Response codes you will find when migrating data over to Hubspot:

- 401 Unauthorized      - The Private App Token is not valid
- 403 Forbidden         - The scopes are not enough to perform the task (you need to review the scopes on the private app)
- 429 Too many requests - The API Limit has been exceeded
- 502/504 timeouts      - You have been blocked by the server due to a large amount of requests, try again in a few seconds

### Docs where you will find more details
- Api Response Codes : https://legacydocs.hubspot.com/docs/faq/api-error-responses
- Api Limits: https://legacydocs.hubspot.com/apps/api_guidelines
- Api Authentication: https://developers.hubspot.com/docs/api/intro-to-auth