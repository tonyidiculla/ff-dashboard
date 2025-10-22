/**
 * Create Test User Script
 * Creates a test user for Playwright tests
 * Run with: npx ts-node e2e/setup/create-test-user.ts
 */

const TEST_USER = {
  email: 'tony@fusionduotech.com',
  password: 'Test123!', // Current password in Supabase Auth
  name: 'Tony Idiculla',
  role: 'SuperAdmin',
};

async function createTestUser() {
  console.log('Creating test user...');
  
  try {
    // Try to register the user
    const response = await fetch('http://localhost:6800/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Test user created successfully!');
      console.log('Email:', TEST_USER.email);
      console.log('Password:', TEST_USER.password);
      return true;
    } else if (data.error?.includes('already exists') || data.error?.includes('already registered')) {
      console.log('ℹ️  Test user already exists');
      
      // Try to login to verify credentials
      const loginResponse = await fetch('http://localhost:6800/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: TEST_USER.password,
        }),
      });
      
      if (loginResponse.ok) {
        console.log('✅ Test user credentials verified!');
        return true;
      } else {
        console.log('⚠️  Test user exists but password may be different');
        console.log('You may need to reset the password or use different credentials');
        return false;
      }
    } else {
      console.error('❌ Failed to create test user:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    return false;
  }
}

createTestUser().then((success) => {
  process.exit(success ? 0 : 1);
});
