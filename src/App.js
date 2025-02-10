import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports'; // Automatically created by Amplify CLI


Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <h1>Welcome to My Yelp App</h1>
    </div>
  );
}

export default withAuthenticator(App);
