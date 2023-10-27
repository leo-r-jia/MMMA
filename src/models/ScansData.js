// ScansData.js
import { API, graphqlOperation } from "aws-amplify";

const ScansData = async (userId) => {
  const listScansQuery = `
        query ListScans {
            listScans(
                filter: { userID: { eq: "${userId}" } }
                ) {
                items {
                    id
                    date
                    userID
                    }
                }
            }
        `;
  try {
    const response = await API.graphql(graphqlOperation(listScansQuery));
    const scans = response.data.listScans.items;

    // Sort the scans by ID in ascending order
    scans.sort((a, b) => b.id.localeCompare(a.id));

    return scans;
  } catch (error) {
    console.error("Error querying scans: ", error);
    return [];
  }
};

export default ScansData;
