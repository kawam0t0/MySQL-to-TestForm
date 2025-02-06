"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CustomerForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    phoneNumber: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/submit-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert("顧客情報が正常に送信されました。")
        setFormData({ companyName: "", name: "", phoneNumber: "" })
      } else {
        alert("エラーが発生しました。もう一度お試しください。")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("エラーが発生しました。もう一度お試しください。")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="companyName">会社名</Label>
        <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="name">名前</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="phoneNumber">電話番号</Label>
        <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
      </div>
      <Button type="submit">送信</Button>
    </form>
  )
}

