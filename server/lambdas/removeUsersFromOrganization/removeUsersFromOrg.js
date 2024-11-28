const { pool } = require('./db');
const { genericHeaders, protectedHeaders } = require('./headers');

const deleteQuery = `
WITH deleted AS (
    DELETE FROM public.organization_user
    WHERE organization_id = $1 AND user_id = $2
    RETURNING 1
    )
SELECT 1 FROM deleted;
`;

/**
 * Removes a user with the matching userId and organizationId from the organization_user table
 * 
 * @param {*} organizationId - The ID of the organization.
 * @param {*} userId - The ID of the user
 */
async function deleteUserFromOrganization(organizationId, userId) {
    const result = await pool.query(deleteQuery, [organizationId, userId]);
    return result.rows[0].result;
}


/**
 * Exported lambda function handler for removing user(s) from organization.
 * Checks if there's an entry with a matching userId and the received organization Id, and deletes the entry from the table if they exist
 * 
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
      notFound: []
    };

    for (const user of users) {
        const deleteResult = deleteUserFromOrganization(organizationId, user.user_id);
      if (deleteResult) {
        results.successful.push({
          ...user
        });

      } else {
        results.notFound.push({
          ...user
        })
      }

    }

    await pool.query('COMMIT');
    console.log(`Results: ${results}`);

    return {
      statusCode: 200,
      headers: genericHeaders,
      body: JSON.stringify({
        message: 'Delete request completed.',
        results: {
          totalProcessed: users.length,
          successfulDeletes: results.successful.length,
          notFound: results.notFound.length,
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
        message: 'Error processing removal',
        error: error.message
      })
    };
  }
};
