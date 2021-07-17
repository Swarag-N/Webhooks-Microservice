
# API 

Import the API Service Collections To Test the Routes
`docs\API_Service.postman_collection.json`

# Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Register WebHooks](#register-webhooks)
  - [Valid Request](#valid-request)
  - [Sample Response](#sample-response)
  - [Sample Response](#sample-response-1)
  - [InValid Request](#invalid-request)
  - [Sample Response](#sample-response-2)
- [List WebHooks](#list-webhooks)
  - [Request](#request)
  - [Sample Response](#sample-response-3)
  - [Sample Response](#sample-response-4)
- [Update](#update)
  - [Valid Request](#valid-request-1)
  - [Sample Response](#sample-response-5)
  - [InValid Request](#invalid-request-1)
  - [Sample Response](#sample-response-6)
- [Delete](#delete)
  - [Valid Request](#valid-request-2)
  - [Sample Response](#sample-response-7)
  - [InValid Request](#invalid-request-2)
  - [Sample Response](#sample-response-8)
- [IP](#ip)
  - [Request](#request-1)
  - [Sample Response](#sample-response-9)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Register WebHooks
### Valid Request
```sh
curl --location --request GET 'http://localhost:3000/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name":"Server 1",
    "hookURL":"http://localhost:4000"
}'
```
### Sample Response
```json
{
    "message": "New Hook Added",
    "_id": "60f2a69af5b9934190ebd1a6"
}
```
### Sample Response
```json
{
    "message": "New Hook Added",
    "_id": "60f2a6a5f5b9934190ebd1a7"
}
```

### InValid Request
```sh
curl --location --request GET 'http://localhost:3000/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name":"Synchronised stable leverage",
    "hookURL":"ftgvhjbjk://ghgh.com"
}'
```
### Sample Response
```json
{
    "message": "WebHook validation failed: hookURL: ftgvhjbjk://ghgh.com is not a valid hookURL!"
}
```




## List WebHooks
### Request
```sh
curl --location --request GET 'http://localhost:3000/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name":"Server 1",
    "hookURL":"http://localhost:4000"
}'
```
### Sample Response
```json
{
    "str": {
        "rows": [
            {
                "_id": "60f2a69af5b9934190ebd1a6",
                "name": "Server 1",
                "hookURL": "http://localhost:4000",
                "__v": 0
            },
            //..truncated
            {
                "_id": "60f2a6a5f5b9934190ebd1a7",
                "name": "Customer-focused radical hierarchy",
                "hookURL": "http://carli.name",
                "__v": 0
            }
        ],
        "total": 5,
        "page": 1,
        "pageSize": 50,
        "totalPages": 1
    },
    "message": "undefined"
}
```
### Sample Response
```json

```




## Update
### Valid Request
```sh
curl --location --request PUT 'http://localhost:3000/update' \
--header 'Content-Type: application/json' \
--data-raw '{
    "_id": "60f15251d2899d288895f23d",
    "name": "Swarag",
    "hookURL": "http://google.com/"
}'
```
### Sample Response
```json
{
    "message": "New Hook Updated",
    "UpdatedWebHook": {
        "_id": "60f15251d2899d288895f23d",
        "name": "Swarag",
        "url": "sdsdsd",
        "hookURL": "http://google.com/"
    }
}
```
### InValid Request
```sh
curl --location --request PUT 'http://localhost:3000/update' \
--header 'Content-Type: application/json' \
--data-raw '{
    "_id": "60f15251d2899d288895f23d",
    "name": "Swarag",
    "hookURL": "http/google.com/"
}'
```
### Sample Response
```json
{
    "message": "Hook Not Proper"
}
```


## Delete
### Valid Request
```sh
curl --location --request DELETE 'http://localhost:3000/delete' \
--header 'Content-Type: application/json' \
--data-raw '{
    "_id": "60f2a8494e63883668e33e03"
}'
```
### Sample Response
```json
{
    "message": "Hook Removed",
    "deletedWebHook": {
        "_id": "60f2a8494e63883668e33e03",
        "name": "Versatile bottom-line capability",
        "hookURL": "http://joaquin.org",
        "__v": 0
    }
}
```
### InValid Request
```sh
curl --location --request DELETE 'http://localhost:3000/delete' \
--header 'Content-Type: application/json' \
--data-raw '{
    "_id": "60f19483b0ea884660ad1231"
}'
```
### Sample Response
```json
{
    "message": "Entity not found"
}
```


## IP
### Request
```curl
curl --location --request GET 'http://localhost:3000/ip'
```
### Sample Response
```json
{
    "message": "Trigger Report",
    "report": {
        "successRequests": [
            {
                "success": true,
                "hookURL": "http://localhost:4000",
                "_id": "60f2a69af5b9934190ebd1a6",
                "name": "Server 1"
            }
        ],
        "retrySuccess1": [],
        "retrySuccess2": [],
        "failed": [
            {
                "success": false,
                "hookURL": "http://google.com/",
                "_id": "60f15251d2899d288895f23d",
                "name": "Swarag"
            },
            {
                "success": false,
                "_id": "60f15251d2899d288895f23f",
                "name": "Huawei P30 Pro"
            },
            {
                "success": false,
                "hookURL": "http://carli.name",
                "_id": "60f2a6a5f5b9934190ebd1a7",
                "name": "Customer-focused radical hierarchy"
            }
        ]
    }
}
```
