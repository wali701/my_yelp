import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { signOut } from '@aws-amplify/auth';  // Directly import signOut from @aws-amplify/auth
import awsconfig from './aws-exports'; // Automatically created by Amplify CLI
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { createRestaurant } from './graphql/mutations';
import { listRestaurants } from './graphql/queries';
import { onCreateRestaurant } from './graphql/subscriptions';
import { API, graphqlOperation } from '@aws-amplify';


import './App'
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

    const subscription = API.graphql(graphqlOperation(onCreateRestaurant)).subscribe({
      next: (eventData) => {
        const payload = eventData.value.data.onCreateRestaurant;
        dispatch({ type: 'SUBSCRIPTION', payload });
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  const getRestaurantList = async () => {
    const restaurants = await API.graphql(graphqlOperation(listRestaurants));
    dispatch({
      type: 'QUERY',
      payload: restaurants.data.listRestaurants.items,
    });
  };

  const createNewRestaurant = async (e) => {
    e.preventDefault();
    const { name, description, city } = state.formData;
    const restaurant = { name, description, city };
    await API.graphql(graphqlOperation(createRestaurant, { input: restaurant }));
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
}
export default withAuthenticator(App);
