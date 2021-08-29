const authService = require('../../services/auth');
const postsService = require('../../services/posts');

// Test runner
function runTests(tests) {
  for (const category of tests) {
    describe(category.title, () => {
      // For each test case under the category
      for (const testCase of category.testCases) {
        it(testCase.label, async () => {
          // Apply arrangements steps
          const arrangeResults = await testCase.arrange();

          // Pass arrange results and await response
          const res = await testCase.act(arrangeResults);

          // Verify assertations:
          // statusCode
          expect(res.statusCode).toEqual(testCase.assertations.statusCode);

          // res.body properties
          for (const [propertyName, expectedValue] of Object.entries(
            testCase.assertations.body
          )) {
            expect(res.body).toHaveProperty(propertyName);
            const actualValue = res.body[propertyName];

            if (expectedValue instanceof Function) {
              expectedValue(actualValue);
            } else {
              expect(actualValue).toEqual(expectedValue);
            }
          }
          expect(Object.keys(res.body).length).toEqual(
            Object.keys(testCase.assertations.body).length
          );
        });
      }
    });
  }
}

// Helper functions

async function getToken({ isAdmin }) {
  const username = isAdmin ? 'admin' : 'standard';

  let existingUser = await authService.findUserByUsername(username);
  if (!existingUser) {
    existingUser = await authService.createUser({
      username,
      password: 'Test1234',
      isAdmin,
    });
  }
  return existingUser.getToken();
}

async function getValidPostId() {
  let posts = await postsService.getAll({});
  if (posts.length === 0) {
    await postsService.load({ count: 3 });
    posts = await postsService.getAll({});
  }

  return posts[0].id;
}

module.exports = { runTests, getToken, getValidPostId };
