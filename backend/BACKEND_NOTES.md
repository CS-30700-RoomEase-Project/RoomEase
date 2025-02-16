# Backend File Structure

```
/backend
├── models                              - Defines all the "classess" important for mongo and data storage
├── node_modules                        - DO NOT TOUCH, node modules back end stuff we dont have to worry about
│   └── (various packages)
├── routes                              - Folder containg the files that correspond to the models and how they get stored in Mongo 
│   ├── userRoutes.js
├── index.js                            - Establishes the server and the connection with the front end
├── .env
├── package.json
├── package-lock.json
└── README.md
```
