import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { signOut } from '@aws-amplify/auth';
import awsconfig from './aws-exports'; // Automatically created by Amplify CLI

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

Amplify.configure(awsconfig);

function App() {
  const handleSignOut = async () => {
    try {
      await signOut(); // Call the signOut method directly
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="App">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Welcome to My Yelp App</h3>
                <button className="btn btn-primary w-100 mb-3" onClick={handleSignOut}>Sign Out</button>
                {/* Custom Sign Out Button */}
                <div className="text-center mt-3">
                  <p className="text-muted">Not signed up yet?</p>
                  <a href="/signup" className="btn btn-secondary">Create an Account</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default withAuthenticator(App);
