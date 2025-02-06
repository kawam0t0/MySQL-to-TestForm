import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: Request) {
  console.log("API route called")

  try {
    const { companyName, name, phoneNumber } = await request.json()
    console.log("Request data:", { companyName, name, phoneNumber })

    console.log("Database config:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      hasPassword: !!process.env.DB_PASSWORD,
    })

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: false, // SSL設定を一時的に無効化
      connectTimeout: 60000,
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })

    console.log("Database connection established")

    try {
      await connection.execute("SELECT 1")
      console.log("Database connection test successful")

      await connection.execute("INSERT INTO customers (company_name, name, phone_number) VALUES (?, ?, ?)", [
        companyName,
        name,
        phoneNumber,
      ])
      console.log("Data inserted successfully")

      await connection.end()
      return NextResponse.json(
        {
          message: "Customer data saved successfully",
          success: true,
        },
        { status: 200 },
      )
    } catch (dbError) {
      console.error("Database operation error:", dbError)
      await connection.end()
      return NextResponse.json(
        {
          message: "Database operation failed",
          error: dbError instanceof Error ? dbError.message : "Unknown database error",
          success: false,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      {
        message: "API route error",
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}

