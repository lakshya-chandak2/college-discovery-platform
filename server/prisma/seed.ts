import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const courseMap: Record<string, string[]> = {
  'IIT': ['B.Tech', 'M.Tech', 'Ph.D', 'BS', 'MS'],
  'IISc': ['B.S.', 'M.Tech', 'Ph.D', 'M.S.'],
  'NIT': ['B.Tech', 'M.Tech', 'Ph.D', 'MCA', 'MBA'],
  'IIIT': ['B.Tech', 'M.Tech', 'Ph.D', 'MS'],
  'BITS': ['B.E.', 'M.E.', 'Ph.D', 'M.Phil'],
  'University': ['B.Tech', 'B.Sc', 'M.Tech', 'M.Sc', 'MBA', 'BBA', 'Ph.D'],
  'Institute': ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'MBA'],
  'College': ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'MBA'],
};

function getCourses(name: string): string[] {
  for (const [key, courses] of Object.entries(courseMap)) {
    if (name.includes(key)) return courses;
  }
  return ['B.Tech', 'M.Tech', 'MBA', 'BCA', 'MCA'];
}

function getType(name: string): string {
  if (name.startsWith('IIT') || name.startsWith('NIT') || name.startsWith('IISc') || name.startsWith('IIIT')) return 'Government';
  if (name.includes('University') && !name.includes('Symbiosis') && !name.includes('Shiv Nadar') && !name.includes('Chandigarh') && !name.includes('Brainware') && !name.includes('Techno') && !name.includes('Galgotias') && !name.includes('PES') && !name.includes('Christ')) return 'Government';
  if (name.includes('Jamia') || name.includes('Aligarh') || name.includes('Banaras') || name.includes('Punjab Engineering') || name.includes('DAIICT') || name.includes('Tata')) return 'Government';
  return 'Private';
}

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.savedCollege.deleteMany();
  await prisma.college.deleteMany();

  // Read college.json
  const jsonPath = path.join(__dirname, '..', '..', 'college.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  // Remove empty lines that break JSON parsing
  const cleaned = raw.replace(/^\s*\n/gm, '');
  const colleges = JSON.parse(cleaned);

  let count = 0;
  for (const c of colleges) {
    await prisma.college.create({
      data: {
        name: c.name,
        location: c.location,
        state: c.location,
        fees: c.fees,
        rating: c.rating,
        placementPercentage: c.placement_percentage,
        courses: JSON.stringify(getCourses(c.name)),
        type: getType(c.name),
      },
    });
    count++;
  }

  console.log(`✅ Seeded ${count} colleges successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
