import { gql, request, GraphQLClient } from 'graphql-request'
const MASTER_URL = "https://us-west-2.cdn.hygraph.com/content/" + process.env.NEXT_PUBLIC_MASTER_URL_KEY + "/master"
const hygraph = new GraphQLClient('https://us-west-2.cdn.hygraph.com/content/cm3jh6j0m024107tau0dj6rut/master');

const getCategory = async () => {
  const query = gql`query Category {
        categories {
          bgcolor {
            hex
          }
          id
          name
          icon {
            url
          }
        }
      }`
  const result = await request(MASTER_URL, query)
  return result
}

const TopBusinessInCategory = async (categoryList) => {
  var result = []
  for (const categoryName of categoryList) {
    const query = gql`query TopBusinessInCategory {
  businessLists(where: { category: { name:"`+ categoryName.name + `" }  rating_not: null  }, orderBy: rating_DESC, first: 1) {
    about
    address
    category {
      name
      image {
        url
      }
    }
    contactPerson
    email
    phoneNumber
    name
    id
    rating
    images {
      url
    }
  }
}`
    const result1 = await request(MASTER_URL, query)
    result.push(result1.businessLists[0])
  }
  return { "businessLists": result }


}

const getBusinessByCategory = async (category) => {
  const query = `query MyQuery {
  businessLists(where:{ category: {name: "`+ category + `"}}) {
    about
    address
    category {
      name
      image {
        url
      }
    }
    contactPerson
    email
    id
    name
    rating
    images {
      url
    }
  }
}`
  const result = await request(MASTER_URL, query)
  return result
}
const getBusinessById = async (id) => {
  const query = gql`query GetBusinessById {
  businessList(where: {id: "`+ id + `"}) {
     about
      address
      category {
        name
      }
      contactPerson
      email
      id
      rating
      name
      images {
        url
      }
        feedback {
        pRating
      }
      recentFeedback:feedback(orderBy: date_DESC, first: 3) {     # This matches your schema's field name
        pRating
        comment
        date
        client {
          fullName
          email
        }
      }
    }
  }`
  const result = await request(MASTER_URL, query)
  return result
}
// In GlobalApi.js
export const getFeedbackCount = async (businessId) => {
  const query = gql`
  query GetFeedbackCount {
    feedbacks(where: {businessList: {id: "${businessId}"}}) {
      id
    }
  }`
  const result = await request(MASTER_URL, query)
  return result.feedbacks.length
}
const checkUserExists = async (email) => {
  const query = gql`
    query CheckUser($email: String!) {
      clients(where: { email: $email }) {
        id
        email
        firstName
        lastName
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query, { email });
    return result.clients.length > 0;
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
};

const CreateOrUpdateUser = async (userData) => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const userExists = await checkUserExists(userData.email);

    if (userExists) {
      console.log("User already exists:", userData.email);
      return null;
    }

    // Si l'utilisateur n'existe pas, créer un nouveau
    const mutation = gql`
      mutation {
        createClient(
          data: {
            email: "${userData.email}"
            firstName: "${userData.firstName}"
            lastName: "${userData.lastName}"
            fullName: "${userData.firstName} ${userData.lastName}"
          }
        ) {
          id
          email
          firstName
          lastName
          fullName
        }
      }
    `;

    const result = await request(MASTER_URL, mutation);
    console.log("New user created:", result);
    return result;
  } catch (error) {
    console.error("GraphQL Error:", {
      message: error.message,
      data: error.response?.errors
    });
    throw error;
  }
};


// Fonction pour connecter l'image au client

const getClientImages = async (email) => {
  const query = gql`
      query GetClientImages($email: String!) {
          client(where: { email: $email }) {
              Images {
                  id
                  url
              }
          }
      }
  `;

  try {
    const result = await request(MASTER_URL, query, { email }, headers);
    return result;
  } catch (error) {
    console.error("Error fetching client images:", error);
    return { client: { Images: [] } };
  }
};


const createNewBooking = async (businessId, date, time, userEmail, userName) => {
  const mutationQuery = gql`
  mutation CreateBooking {
  createBooking(
    data: {bookingStatus: booked, businessList: {connect: {id: "`+ businessId + `"}}, date: "` + date + `", time: "` + time + `", userEmail: "` + userEmail + `", userName: "` + userName + `"}
  ) {
    id
  }
    publishManyBookings(to: PUBLISHED) {
    count
  }
}`
  const result = await request(MASTER_URL, mutationQuery)
  return result
}
const BusinessBookedSlot = async (businessId, date) => {
  const query = gql`
  query BusinessBookedSlot {
  bookings(where: {businessList: {id: "`+ businessId + `"}, date: "` + date + `"}) {
    date
    time
  }
}`
  const result = await request(MASTER_URL, query)
  return result
}
const GetUserBookingHistory = async (userEmail) => {
  const query = gql`query MyQuery {
  bookings(where: {userEmail: "`+ userEmail + `"}
  orderBy: publishedAt_DESC) {
    businessList {
      name
      images {
        url
      }
      contactPerson
      address
    }
    date
    time
  }
}`
  const result = await request(MASTER_URL, query)
  return result
}
/// In GlobalApi.js


export const getClientByEmail = async (email) => {
  try {
    const query = gql`
      query GetClientByEmail($email: String!) {
        clients(where: { email: $email }, first: 1) {
          id
          email
        }
      }
    `;

    const result = await request(MASTER_URL, query, { email });

    if (result.clients && result.clients.length > 0) {
      return result.clients[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error in getClientByEmail:", error);
    throw error;
  }
};


// Update the feedback submission method
export const createNewFeedback = async (businessId, rating, comment, clientId) => {
  try {
    // First, get all feedbacks for this business to calculate new average
    const getFeedbacks = gql`
      query GetBusinessFeedbacks {
        businessList(where: {id: "${businessId}"}) {
          feedback {
            pRating
          }
        }
      }
    `;

    const feedbacksData = await request(MASTER_URL, getFeedbacks);
    const allRatings = [...feedbacksData.businessList.feedback.map(f => f.pRating), rating];
    const newAvgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;

    // Your existing mutation structure with added rating update
    const mutation = gql`
      mutation CreateFeedback($rating: Float!, $comment: String!, $businessId: ID!, $clientId: ID!, $newAvgRating: Float!) {
        createFeedback(
          data: {
            pRating: $rating,
            comment: $comment,
            businessList: { connect: { id: $businessId } }
            client: { connect: { id: $clientId } }
          }
        ) {
          id
          pRating
          comment
        }
        updateBusinessList(
          where: { id: $businessId }
          data: { rating: $newAvgRating }
        ) {
          id
          rating
        }
        publishManyFeedbacks(to: PUBLISHED) {
          count
        }
        publishBusinessList(where: { id: $businessId }) {
          id
        }
      }
    `;

    const result = await request(MASTER_URL, mutation, {
      rating,
      comment,
      businessId,
      clientId,
      newAvgRating: parseFloat(newAvgRating.toFixed(1))
    });

    return result;
  } catch (error) {
    console.error("Error in createNewFeedback:", error);
    throw error;
  }
};
const getClientProfile = async (email) => {
  const query = gql`
    query GetClientProfile($email: String!) {
      client(where: { email: $email }) {
        id
        email
        firstName
        lastName
        profileImage {
          id
          url
        }
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query, { email });
    return result.client;
  } catch (error) {
    console.error("Error fetching client profile:", error);
    throw error;
  }
};
export const getClientReviewsCount = async (clientId) => {
  const query = gql`
      query GetClientReviewsCount($clientId: ID!) {
          feedbacks(where: { client: { id: $clientId } }) {
              id
          }
      }
  `;

  try {
    const result = await request(MASTER_URL, query, { clientId });
    return result.feedbacks.length;
  } catch (error) {
    console.error("Error in getClientReviewsCount:", error);
    return 0;
  }
};

const getFilteredBusinesses = async (category, city, rating) => {
  const query = gql`
    query FilteredBusinesses {
      businessLists(
        where: {
          ${category !== 'All' ? `category: { name: "${category}" } ` : ''}
          ${city ? `address_contains: "${city}" ` : ''}
          ${rating ? `rating_gte: ${rating} ` : ''}
        }
      ) {
        about
        address
        category {
          name
          image {
            url
          }
        }
        contactPerson
        email
        id
        name
        rating
        images {
          url
        }
      }
    }
  `;
  console.log(query);
  const result = await request(MASTER_URL, query);
  return result;
};


export const getCategoryId = async (categoryName) => {
  const query = gql`
      query GetCategory($name: String!) {
          categories(where: { name: $name }) {
              id
          }
      }
  `;

  try {
    const result = await request(MASTER_URL, query, { name: categoryName });
    return result.categories[0]?.id;
  } catch (error) {
    console.error('Error getting category ID:', error);
    throw error;
  }
};

// Fonction principale pour créer un business
export const createBusinessList = async (businessData) => {
  // D'abord obtenir l'ID de la catégorie
  const categoryId = await getCategoryId(businessData.category);

  const mutation = gql`
      mutation CreateBusinessList(
          $name: String!
          $contactPerson: String!
          $city: String!
          $phoneNumber: String!
          $address: String!
          $about: String!
          $email: String!
          $categoryId: ID!
      ) {
          createBusinessList(
              data: {
                  name: $name
                  contactPerson: $contactPerson
                  city: $city
                  phoneNumber: $phoneNumber
                  address: $address
                  about: $about
                  email: $email
                  category: { connect: { id: $categoryId } }
              }
          ) {
              id
              name
          }
      }
  `;

  try {
    // Créer le business
    const result = await request(MASTER_URL, mutation, {
      name: businessData.name,
      contactPerson: businessData.contactPerson,
      city: businessData.city,
      phoneNumber: businessData.phoneNumber,
      address: businessData.address,
      about: businessData.about,
      email: businessData.email,
      categoryId: categoryId
    });

    // Si la création est réussie, publier le business
    if (result.createBusinessList?.id) {
      const publishMutation = gql`
              mutation PublishBusiness($id: ID!) {
                  publishBusinessList(where: { id: $id }) {
                      id
                  }
              }
          `;

      await request(MASTER_URL, publishMutation, {
        id: result.createBusinessList.id
      });
    }

    return result.createBusinessList;
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }

};
export default {
  getCategory,
  TopBusinessInCategory,
  getBusinessByCategory,
  getBusinessById,
  createNewBooking,
  BusinessBookedSlot,
  GetUserBookingHistory,
  CreateOrUpdateUser,
  getClientImages,
  getClientProfile,
  getClientByEmail,
  createNewFeedback,
  getClientReviewsCount,
  getFilteredBusinesses
}