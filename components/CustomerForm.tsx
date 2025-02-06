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
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: null, message: "" })
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Response:", data)

      if (response.ok && data.success) {
        setStatus({
          type: "success",
          message: "顧客情報が正常に送信されました。",
        })
        setFormData({ companyName: "", name: "", phoneNumber: "" })
      } else {
        setStatus({
          type: "error",
          message: `エラー: ${data.error || data.message || "不明なエラーが発生しました"}`,
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      setStatus({
        type: "error",
        message: "ネットワークエラーが発生しました。",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="companyName">会社名</Label>
        <Input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="name">名前</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
      </div>
      <div>
        <Label htmlFor="phoneNumber">電話番号</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      {status.message && (
        <div
          className={`p-4 rounded ${
            status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "送信中..." : "送信"}
      </Button>
    </form>
  )
}

