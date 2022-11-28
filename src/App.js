import React, { useState, useEffect } from "react";
import * as Realm from "realm-web";

// Create the Application
const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID});

// Define the App component

// console.log(process.env.REACT_APP_REALM_ID);

const App = () => {
  // Set state variables
  const [user, setUser] = useState();
  const [events, setEvents] = useState([]); // This useEffect hook will run only once when the page is loaded // This useEffect hook will run only once when the page is loaded

  useEffect(() => {
    const login = async () => {
      // Authenticate anonymously
      const user = await app.logIn(Realm.Credentials.anonymous());
      setUser(user); // Connect to the database

      const mongodb = app.currentUser.mongoClient("mongodb-atlas");
      const collection = mongodb.db("data").collection("changestream"); // Everytime a change happens in the stream, add it to the list of events

      for await (const change of collection.watch()) {
        setEvents((events) => [...events, change]);
      }
    };
    login();
  }, []); // Return the JSX that will generate HTML for the page

  // Return the JSX that will generate HTML for the page
  return (
    <div className="App">
    
      {!!user && (
        <div className="App-header">
          <h1>Connected as user ${user.id}</h1>
          
          <div>
            <h2>Latest events:</h2>
            
            <table>
              
              <thead>
                
                <tr>
                  <td>Operation</td>
                  <td>Document Key</td>
                  <td>Full Document</td>
                </tr>
              
              </thead>
              
              <tbody>
                
                {events.map((e, i) => (
                  <tr key={i}>
                    <td>{e.operationType}</td>
                    <td>{e.documentKey._id.toString()}</td>
                    <td>{JSON.stringify(e.fullDocument)}</td>
                  </tr>
                ))}
              
              </tbody>
            
            </table>
         
          </div>
          
        </div>
      )}
    
    </div>
  );
};

export default App;
