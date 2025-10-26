import { Knex } from "knex";
import * as bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
  // clear tables
  await knex("absences").del().catch(()=>{});
  await knex("feedbacks").del().catch(()=>{});
  await knex("profiles").del().catch(()=>{});
  await knex("users").del().catch(()=>{});

  const password = await bcrypt.hash("Password123!", 10);

   const insertAndGetId = async (user: Record<string, any>): Promise<number> => {
    const result: any = await knex('users').insert(user).returning('id');

    // Normalize result: it could be [ { id: 1 } ], [1], or { id: 1 }
    if (Array.isArray(result)) {
      const first = result[0];
      return typeof first === 'object' && first !== null ? first.id : first;
    }
    if (result && typeof result === 'object' && 'id' in result) {
      return result.id;
    }
    throw new Error('Could not retrieve inserted user id');
  };

  // Insert users
  const managerId = await insertAndGetId({
    email: "manager@org.test",
    password,
    role: "manager"
  })

  const aliceId = await insertAndGetId({
    email: "alice@org.test",
    password,
    role: "employee"
  })

  const bobId = await insertAndGetId({
    email: "bob@org.test",
    password,
    role: "coworker"
  })

  const carolId = await insertAndGetId({
    email: "carol@org.test",
    password,
    role: "employee"
  })

  // Profiles (alice = owner id)
  await knex("profiles").insert([
    {
      user_id: managerId,
      first_name: "Manager",
      last_name: "One",
      bio: "Manager of the team",
      phone: "000-000-0000",
      location: "HQ",
      sensitive_data_visible: true
    },
    {
      user_id: aliceId || 2,
      first_name: "Alice",
      last_name: "Employee",
      bio: "Owner of profile 2",
      phone: "111-111-1111",
      location: "Remote",
      sensitive_data_visible: true
    },
    {
      user_id: bobId || 3,
      first_name: "Bob",
      last_name: "Coworker",
      bio: "Coworker",
      phone: "222-222-2222",
      location: "Office",
      sensitive_data_visible: false
    },
    {
      user_id: carolId || 4,
      first_name: "Carol",
      last_name: "Employee",
      bio: "Employee",
      phone: "333-333-3333",
      location: "Office",
      sensitive_data_visible: false
    }
  ]);
}
