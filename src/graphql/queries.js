export const listRestaurants = /* GraphQL */ `
  query ListRestaurants {
    listRestaurants {
      items {
        id
        name
        description
        city
      }
    }
  }
`;
