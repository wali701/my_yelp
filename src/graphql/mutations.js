// For creating a restaurant
export const createRestaurant = /* GraphQL */ `
  mutation CreateRestaurant(
    $name: String!
    $description: String!
    $city: String!
  ) {
    createRestaurant(input: { name: $name, description: $description, city: $city }) {
      id
      name
      description
      city
    }
  }
`;

// For updating a restaurant
export const updateRestaurant = /* GraphQL */ `
  mutation UpdateRestaurant(
    $id: ID!
    $name: String
    $description: String
    $city: String
  ) {
    updateRestaurant(
      input: { id: $id, name: $name, description: $description, city: $city }
    ) {
      id
      name
      description
      city
    }
  }
`;

// For deleting a restaurant
export const deleteRestaurant = /* GraphQL */ `
  mutation DeleteRestaurant(
    $id: ID!
  ) {
    deleteRestaurant(input: { id: $id }) {
      id
      name
      description
      city
    }
  }
`;
