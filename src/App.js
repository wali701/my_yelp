import { useEffect, useReducer } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { GraphQLAPI, graphqlOperation } from '@aws-amplify/api-graphql';
import { signOut } from '@aws-amplify/auth';
import awsconfig from './aws-exports';
import { createRestaurant } from './graphql/mutations';
import { listRestaurants } from './graphql/queries';
import { onCreateRestaurant } from './graphql/subscriptions';

Amplify.configure(awsconfig);

const initialState = {
  restaurants: [],
  formData: {
    name: '',
    city: '',
    description: '',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'QUERY':
      return { ...state, restaurants: action.payload };
    case 'SUBSCRIPTION':
      return { ...state, restaurants: [...state.restaurants, action.payload] };
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getRestaurantList();

    const subscription = GraphQLAPI.graphql(graphqlOperation(onCreateRestaurant)).subscribe({
      next: (eventData) => {
        const payload = eventData.value.data.onCreateRestaurant;
        dispatch({ type: 'SUBSCRIPTION', payload });
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  const getRestaurantList = async () => {
    try {
      const response = await GraphQLAPI.graphql(graphqlOperation(listRestaurants));
      if (response && response.data && response.data.listRestaurants) {
        const restaurants = response.data.listRestaurants.items;
        console.log('Fetched Restaurants:', restaurants);
        dispatch({
          type: 'QUERY',
          payload: restaurants,
        });
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const createNewRestaurant = async (e) => {
    e.preventDefault();
    const { name, description, city } = state.formData;
    const restaurant = { name, description, city };
    await GraphQLAPI.graphql(graphqlOperation(createRestaurant, { input: restaurant }));
    dispatch({
      type: 'SET_FORM_DATA',
      payload: { name: '', description: '', city: '' },
    });
  };

  const handleChange = (e) => {
    dispatch({
      type: 'SET_FORM_DATA',
      payload: { [e.target.name]: e.target.value },
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div>
      <h1>Restaurant List</h1>
      <ul>
        {state.restaurants.map((restaurant, index) => (
          <li key={index}>
            {restaurant.name} - {restaurant.city}
          </li>
        ))}
      </ul>

      <h2>Create New Restaurant</h2>
      <form onSubmit={createNewRestaurant}>
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={state.formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={state.formData.city}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={state.formData.description}
          onChange={handleChange}
        />
        <button type="submit">Create Restaurant</button>
      </form>

      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default withAuthenticator(App);
