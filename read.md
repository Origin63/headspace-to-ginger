
## Hubspot CRM Notes

Typical Response codes you will find when migrating data over to Hubspot:

- 401 Unauthorized      - The Private App Token is not valid
- 403 Forbidden         - The scopes are not enough to perform the task (you need to review the scopes on the private app)
- 429 Too many requests - The API Limit has been exceeded
- 502/504 timeouts      - You have been blocked by the server due to a large amount of requests, try again in a few seconds

### Special note for error {"status":"error","message":"Property values were not valid: [{\"isValid\":false,\"message\":\"1521225089103 is at 18:31:29.103 UTC, not midnight!\",\"error\":\"INVALID_DATE\",\"name\":\"h4w_create_date\"}]","correlationId":"37227306-08c1-4d91-aa46-4a947a80e6aa","category":"VALIDATION_ERROR"}

- When getting the error "invalid date" in a Hubspot "Date Picker" Property note: when you create a date picker in the UI it gets created as type "date", so, if you pass a value of type datetime you will get the error above "invalid date". To correct this, you either have to pass a date value without time as an ISO String or change the schema of the property from type "date" to type "datetime". See example below:

{
    "updatedAt": "2022-12-19T23:47:38.808Z",
    "createdAt": "2022-12-19T23:47:38.808Z",
    "name": "h4w_create_date",
    "label": "H4W Create Date",
    "type": "datetime",
    "fieldType": "date",
}

### Docs where you will find more details
- Api Response Codes : https://legacydocs.hubspot.com/docs/faq/api-error-responses
- Api Limits: https://legacydocs.hubspot.com/apps/api_guidelines
- Api Authentication: https://developers.hubspot.com/docs/api/intro-to-auth
