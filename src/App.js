import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { signOut } from '@aws-amplify/auth';  // Directly import signOut from @aws-amplify/auth

import awsconfig from './aws-exports'; // Automatically created by Amplify CLI

Amplify.configure(awsconfig);

function App() {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="App">
      <h1>Welcome to My Yelp App</h1>
      <button onClick={handleSignOut}>Sign Out</button>  {/* sign-out button */}
    </div>
  );
}

export default withAuthenticator(App);
