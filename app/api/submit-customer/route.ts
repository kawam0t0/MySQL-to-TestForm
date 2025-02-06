import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: Request) {
  try {
    const { companyName, name, phoneNumber } = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        // SSL設定を無効化（開発環境でのテスト用）
        rejectUnauthorized: false,
      },
    })

    try {
      console.log("Attempting to insert data...")
      await connection.execute("INSERT INTO customers (company_name, name, phone_number) VALUES (?, ?, ?)", [
        companyName,
        name,
        phoneNumber,
      ])
      console.log("Data inserted successfully")

      await connection.end()
      return NextResponse.json({ message: "Customer data saved successfully" }, { status: 200 })
    } catch (dbError) {
      console.error("Database error:", dbError)
      await connection.end()
      return NextResponse.json(
        {
          message: "Database error",
          error: dbError instanceof Error ? dbError.message : "Unknown database error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        message: "API error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

