import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: Request) {
  try {
    const { companyName, name, phoneNumber } = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST, // Cloud SQLのIPアドレスまたはホスト名
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: true, // SSL接続を強制
      },
    })

    try {
      await connection.execute("INSERT INTO customers (company_name, name, phone_number) VALUES (?, ?, ?)", [
        companyName,
        name,
        phoneNumber,
      ])
      console.log("Data inserted successfully")

      return NextResponse.json({ message: "Customer data saved successfully" }, { status: 200 })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          message: "Database error",
          error: dbError instanceof Error ? dbError.message : "Unknown database error",
        },
        { status: 500 },
      )
    } finally {
      await connection.end()
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

