
const { PrismaClient } = require('./src/generated/prisma_new');
const prisma = new PrismaClient();

async function testOperations() {
  console.log('--- Testing Create Lead ---');
  try {
    const lead = await prisma.lead.create({
      data: {
        name: 'Test Lead',
        email: 'testlead@example.com',
        company: 'Test Co',
        message: 'Hello'
      }
    });
    console.log('Lead created:', lead.id);
  } catch (e) {
    console.error('Lead failed:', e.message);
  }

  console.log('\n--- Testing Create Team Member ---');
  try {
    const team = await prisma.teamMember.create({
      data: {
        name: 'Test Team',
        email: 'testteam@example.com',
        role: 'Developer'
      }
    });
    console.log('Team member created:', team.id);
  } catch (e) {
    console.error('Team member failed:', e.message);
  }

  console.log('\n--- Testing Create Invoice ---');
  try {
    // Need a client first
    let client = await prisma.client.findFirst();
    if (!client) {
      client = await prisma.client.create({
        data: {
          companyName: 'Temp Client',
          contactName: 'Temp Contact',
          email: 'temp@client.com'
        }
      });
    }
    const invoice = await prisma.invoice.create({
      data: {
        clientId: client.id,
        invoiceNo: 'INV-TEST-001',
        title: 'Test Invoice',
        total: 100,
        subtotal: 100,
        tax: 0,
        items: [{ description: 'Item 1', qty: 1, rate: 100, amount: 100 }]
      }
    });
    console.log('Invoice created:', invoice.id);
  } catch (e) {
    console.error('Invoice failed:', e.message);
  }

  await prisma.$disconnect();
}

testOperations();
