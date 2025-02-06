import React from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

function App({ signOut, user }) {
  return (
    <div>
      <h1>Welcome to My Yelp</h1>
      <h2>Hello, {user.username}!</h2>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(App);
