import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import awsExports from "./aws-exports";
import { listRestaurants } from "./graphql/queries";
import { createRestaurant, deleteRestaurant } from "./graphql/mutations"; // Import delete mutation
import { withAuthenticator } from "@aws-amplify/ui-react"; 
import './App.css';

Amplify.configure(awsExports);
const API = generateClient();

function App() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({ name: "", description: "" });

  useEffect(() => {
    getCurrentUser()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const restaurantData = await API.graphql({ query: listRestaurants }); 
      setRestaurants(restaurantData.data.listRestaurants.items);
    } catch (error) {
      console.error("Error fetching restaurants", error);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.description) {
      console.error("Restaurant name and description are required!");
      return;
    }

    if (!user || !user.username) {
      console.error("User is not authenticated or username is missing");
      return;
    }

    try {
      const input = {
        name: newRestaurant.name,
        description: newRestaurant.description,
        owner: user.username,
      };

      console.log("Creating restaurant with input:", input);

      const result = await API.graphql({
        query: createRestaurant,
        variables: { input },
      });

      console.log("Restaurant created successfully:", result);
      setNewRestaurant({ name: "", description: "" });
      fetchRestaurants();
    } catch (error) {
      console.error("Error creating restaurant:", JSON.stringify(error, null, 2));
    }
  };

  const handleRemoveRestaurant = async (id) => {
    try {
      await API.graphql({
        query: deleteRestaurant,
        variables: { input: { id } },
      });

      console.log(`Restaurant with id ${id} deleted`);
      setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id)); 
    } catch (error) {
      console.error("Error deleting restaurant:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <div>
      <h1 className="container"> MY YELP APP </h1>

      {user ? (
        <div className="container">
          <p>Welcome, {user.signInDetails.loginId || user.username}!</p>
          

          <h2>Create a New Restaurant</h2>
          <form onSubmit={handleCreateRestaurant}>
            <input
              type="text"
              placeholder="Restaurant Name"
              value={newRestaurant.name}
              onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newRestaurant.description}
              onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
              required
            />
            <button type="submit">Add Restaurant</button>
          </form>

          <h2>Restaurants</h2>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <strong>{restaurant.name}</strong> - {restaurant.description} 
                <button 
                  onClick={() => handleRemoveRestaurant(restaurant.id)} 
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                >
                  Remove
                </button>
                
              </li>
            ))}
          </ul>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
          
      ) : (
        <p className="container">Please sign in to add restaurants.</p>
      )}
    </div>
  );
}

export default withAuthenticator(App);
