# Frontend File Structure

The following is the file structure for the frontend of the RoomEase project:

```
frontend/
├── public/                - Can Ignore
│   ├── index.html
├── src/
│   ├── components/             - Most of the front end work will be here 
    │   ├── calendar/           - Components for the calander section (chores, grocery and etc will go in their own files)
    │   ├── chores/
    │   ├── grocery_split/
    │   ├── pages/              - All the different pages we will have (Login Page, Master room page, etc.) 
    │   ├── shared_components/  - And shared components between the different pages (ex: buttons, etc. )
│   ├── App.js                  - Defines all the page routes (will work with the files in the page folder) 
│   ├── index.js
├── package.json
└── README.md
```