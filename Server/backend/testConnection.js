require('dotenv').config();
const { sequelize } = require('./src/config/database');

// Import models to ensure they are registered with Sequelize
require('./src/models/user.model');
require('./src/models/product.model');
require('./src/models/order.model');

async function testConnection() {
  try {
    // Test database connection
    console.log('🔄 Attempting to connect to MySQL database...');
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    // Sync all models
    console.log('🔄 Synchronizing models with database...');
    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');

    // List all models registered with Sequelize
    console.log('\n📋 Registered models:');
    Object.keys(sequelize.models).forEach(modelName => {
      console.log(`  - ${modelName}`);
    });

    // Test a simple query
    console.log('\n🔄 Testing a simple query...');
    const result = await sequelize.query('SELECT 1+1 as result');
    console.log('✅ Query test successful');

  } catch (error) {
    console.error('❌ Database connection test failed:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('\n👋 Connection closed. Test complete.');
    process.exit(0);
  }
}

testConnection();