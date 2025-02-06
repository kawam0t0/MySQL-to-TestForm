import CustomerForm from "@/components/CustomerForm"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">顧客情報フォーム</h1>
      <CustomerForm />
    </main>
  )
}