import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: Request) {
  const { companyName, name, phoneNumber } = await request.json()

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    await connection.execute("INSERT INTO customers (company_name, name, phone_number) VALUES (?, ?, ?)", [
      companyName,
      name,
      phoneNumber,
    ])

    await connection.end()

    return NextResponse.json({ message: "Customer data saved successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error details:", error)
    // エラーオブジェクトの型を適切に処理
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ message: "Error saving customer data", error: errorMessage }, { status: 500 })
  }
}

