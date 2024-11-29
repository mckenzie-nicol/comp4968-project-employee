const { pool } = require('./db');
const { genericHeaders, protectedHeaders } = require('./headers');

const getAllOrganizationUsersQuery = `
  SELECT 
    u.*, 
    ou.role 
  FROM 
    public."user" u
  INNER JOIN 
    public.organization_user ou 
  ON 
    u.id = ou.user_id
  WHERE 
    ou.organization_id = $1;
`;


/**
 * Retrieves all Users belonging to a certain organization.
 * 
 * @param {string} organizationId - The ID of the organization.
 * @returns {Promise<Array>} - Array of user objects
 */
async function getAllUsersOfOrganization(organizationId) {
  const result = await pool.query(getAllOrganizationUsersQuery, [organizationId]);
  return result.rows;
}

/**
 * Exported lambda function handler for getting all Users of an organization.
 * 
 * @param {object} event - The Lambda event object
 * @returns {object} - The HTTP response
 */
exports.handler = async (event) => {
  console.log("Event Received: ", event);
  const { organizationId } = event.pathParameters;

  try {
    const results = await getAllUsersOfOrganization(organizationId);
    
    console.log(`Results: ${JSON.stringify(results)}`);
    
    return {
      statusCode: 200,
      headers: genericHeaders,
      body: JSON.stringify({
        message: 'Users retrieved successfully.',
        results: results
      })
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: genericHeaders,
      body: JSON.stringify({
        message: 'Error retrieving Users.',
        error: error.message
      })
    };
  }
};