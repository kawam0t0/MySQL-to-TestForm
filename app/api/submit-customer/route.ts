import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function POST(request: Request) {
  const { companyName, name, phoneNumber } = await request.json()

  const config = {
    socketPath: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }

  try {
    const connection = await mysql.createConnection(config)

    await connection.execute(
      'INSERT INTO customers (company_name, name, phone_number) VALUES (?, ?, ?)',
      [companyName, name, phoneNumber]
    )

    await connection.end()

    return NextResponse.json({ message: 'Customer data saved successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json({ message: 'Error saving customer data', error: error.message }, { status: 500 })
  }
}
