const { pool } = require('./db');

// Query for finding user in DB
const findUserQuery = `
  SELECT id 
  FROM public.user
  WHERE LOWER(email) = LOWER($1) 
`;

// Query to add user to organization
const addToOrgQuery = `
  INSERT INTO public.organization_user (
    organization_id, 
    user_id, 
    role, 
    created_at
  )
  VALUES ($1, $2, $3, NOW())
  ON CONFLICT (organization_id, user_id) 
  DO NOTHING
  RETURNING EXISTS (SELECT 1 FROM public.organization_user WHERE organization_id = $1 AND user_id = $2) AS inserted;
`;
/**
 * Finds a user in the database by email.
 * @param {string} email - The user's email address
 * @returns {Promise<number|null>} - The user's ID or null if not found
 */
async function findUserInDatabaseByEmail(email) {
  const userResult = await pool.query(findUserQuery, [email]);
  return (userResult.rows.length > 0 ? userResult.rows[0].id : null);
}

/**
 * Checks if a user is already a member of an organization.
 * @param {number} organizationId - The ID of the organization
 * @param {number} userId - The ID of the user
 * @returns {Promise<boolean>} - True if the user is a member, false otherwise
 */
async function isUserInOrganization(organizationId, userId) {
  const membershipResult = await pool.query(checkMembershipQuery, [
    organizationId,
    userId
  ]);
  return membershipResult.rows.length > 0;
}

/**
 * Adds a user to an organization.
 * @param {number} organizationId - The ID of the organization.
 * @param {number} userId - The ID of the user
 * @param {string} role - The role assigned to the user in the organization
 * @returns {Promise<object>} - The newly created membership record
 */
async function addUserToOrganization(organizationId, userId, role) {
  const insertResult = await pool.query(addToOrgQuery, [
    organizationId,
    userId,
    role
  ]);
  return insertResult.rows[0];
}


/**
 * Exported lambda function handler for inviting user(s) to organization.
 * Checks if user with a matching email exists in DB, if they're already in the organization, and adds them to it if not
 * @param {*} event - The Lambda event object
 * @returns {object} - The HTTP response
 */
exports.handler = async (event) => {
  console.log("Event Received: ", event);
  const { organizationId } = event.pathParameters;
  const { users } = JSON.parse(event.body);

  try {
    await pool.query('BEGIN');

    const results = {
      successful: [],
      notFound: [],
      alreadyInOrg: []
    };

    for (const user of users) {
      // Check if user with the same email in user table
      const userId = await findUserInDatabaseByEmail(user.email);
      if (!userId) {
        results.notFound.push(user);
        continue;
      }
    
      const newMembership = await addUserToOrganization(
        organizationId,
        userId,
        user.role
      );

      if (newMembership) {
        results.successful.push({
          ...user,
          userId
        });
      } else {
        results.alreadyInOrg.push({
          ...user,
          userId
        })
      }
    }

    await pool.query('COMMIT');
    console.log(`Results: ${results}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Invitation processing completed',
        results: {
          totalProcessed: users.length,
          successfulInvites: results.successful.length,
          notFound: results.notFound.length,
          alreadyInOrg: results.alreadyInOrg.length,
          details: results
        }
      })
    };
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing invitations',
        error: error.message
      })
    };
  }
};
