import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { getCurrentUser, signOut, signIn, signUp } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import awsExports from "./aws-exports";
import { listRestaurants } from "./graphql/queries";
import { createRestaurant } from "./graphql/mutations";

Amplify.configure(awsExports);
const API = generateClient();

function App() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({ name: "", description: "" });

  // Check if user is authenticated
  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
    fetchRestaurants();
  }, []);

  // Fetch restaurants from API
  const fetchRestaurants = async () => {
    try {
      const restaurantData = await API.graphql({
        query: listRestaurants,
      });
      setRestaurants(restaurantData.data.listRestaurants.items);
    } catch (error) {
      console.error("Error fetching restaurants", error);
    }
  };

  // Create a new restaurant
  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.description) return;

    try {
      const input = {
        name: newRestaurant.name,
        description: newRestaurant.description,
        owner: user?.username,
      };
      await API.graphql({
        query: createRestaurant,
        variables: { input },
      });
      setNewRestaurant({ name: "", description: "" });
      fetchRestaurants(); // Refresh the list
    } catch (error) {
      console.error("Error creating restaurant", error);
    }
  };

  // Handle user sign in
  const handleSignIn = async () => {
    try {
      await signIn({ username: "testuser", password: "Test@1234" });
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  // Handle user sign up (for demo purposes)
  const handleSignUp = async () => {
    try {
      await signUp({
        username: "testuser",
        password: "Test@1234",
        attributes: { email: "test@example.com" },
      });
      console.log("User signed up successfully");
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  return (
    <div>
      <h1>My Yelp App</h1>

      {user ? (
        <>
          <p>Welcome, {user.username}</p>
          <button onClick={() => signOut().then(() => setUser(null))}>Sign Out</button>

          <h2>Create a New Restaurant</h2>
          <form onSubmit={handleCreateRestaurant}>
            <input
              type="text"
              placeholder="Name"
              value={newRestaurant.name}
              onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newRestaurant.description}
              onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
            />
            <button type="submit">Add Restaurant</button>
          </form>

          <h2>Restaurants</h2>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <strong>{restaurant.name}</strong>: {restaurant.description}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p>Please sign in or sign up.</p>
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </>
      )}
    </div>
  );
}

export default App;
