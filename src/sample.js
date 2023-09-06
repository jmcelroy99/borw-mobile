export const sampleSuccess = {
  "success": true,
  "user": {
    "firstName": "Daniel",
    "lastName": "Dinh",
    "phoneNumber": "+",
    "email": "daniel@gmail.net",
    "isBusiness": false,
    "verifiedPhoneNumber": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInN1YlRva2VuIjoiZG56MGRlbzNlN3JrY2U4eWEzayIsImlhdCI6MTU5NDI2NjIzMiwiZXhwIjoxNTk2ODU4MjMyfQ.BN1IL6so1_mxM2-qRkSt3eQWii-222l2ljuaBczzJ74"
  }
}

export const sampleError = {
  "status": 409,
  "msg": "Email is already signed",
  "stack": "CustomError: Email is already signed\n    at Object.<anonymous> (/Users/macbookpro/Data/Working/NUSTechnology/Projects/Borw/Server_Code/Build_Local/src/common/error.js:54:37)\n    at Module._compile (internal/modules/cjs/loader.js:955:30)\n    at Module._compile (/Users/macbookpro/Data/Working/NUSTechnology/Projects/Borw/Server_Code/Build_Local/node_modules/pirates/lib/index.js:99:24)\n    at Module._extensions..js (internal/modules/cjs/loader.js:991:10)\n    at Object.newLoader [as .js] (/Users/macbookpro/Data/Working/NUSTechnology/Projects/Borw/Server_Code/Build_Local/node_modules/pirates/lib/index.js:104:7)\n    at Module.load (internal/modules/cjs/loader.js:811:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:723:14)\n    at Module.require (internal/modules/cjs/loader.js:848:19)\n    at require (internal/modules/cjs/helpers.js:74:18)\n    at Object.<anonymous> (/Users/macbookpro/Data/Working/NUSTechnology/Projects/Borw/Server_Code/Build_Local/src/module/user/repository/createUser.js:2:1)",
  "code": 1104
}

export const sampleOTPSuccess = {
  "success": true,
}

export const sampleCheckOTPSuccess = {
  "user": {
    "email": "daniel@gmail.net",
    "firstName": "Daniel",
    "isBusiness": false,
    "lastName": "Dinh",
    "phoneNumber": "+840706029933",
    "verifiedPhoneNumber": true
  }
}

export const sampleChangePasswordSuccess = {
  "success": true,
}

export const sampleLoginSuccess = {
  "success": true,
  "user": {
    "firstName": "Thuy",
    "lastName": "Nguyen",
    "phoneNumber": "+84706029932",
    "email": "test@yopmail.com",
    "isBusiness": false,
    "verifiedPhoneNumber": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViVG9rZW4iOiI2d2thYWRtbTR0dGtjZnhvaTJqIiwiaWF0IjoxNTk0MzY4MjMzLCJleHAiOjE1OTY5NjAyMzN9.cCWJxiJ4N9swZh_DSjn9os4YnQ15-VHf_SS6KN5a_qo"
  }
}

export const sampleOrderSuccess = {
  "order": {
    "cancelled": false,
    "completed": false,
    "archived": false,
    "extraFees": "0",
    "id": 10,
    "durationTime": "1 day",
    "from": "2020-07-14T06:20:11.037Z",
    "deliveryType": "hand",
    "transaction": "donation",
    "passedSteps": [
      "waiting"
    ],
    "productId": 1,
    "ownerId": 1,
    "ordererId": 1,
    "price": "100",
    "rentalPrice": "10",
    "discount": "0",
    "deliveryCost": "0",
    "taxFees": "0",
    "address": "",
    "location": "10.8033169,106.6321766",
    "note": "",
    "updatedAt": "2020-07-24T02:25:13.266Z",
    "createdAt": "2020-07-24T02:25:13.266Z"
  }
}